package Filter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entities.User;
import enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.UserService;
import util.JwtUtil;

import java.io.IOException;
import java.security.Key;
import java.util.Map;

import jakarta.servlet.*;

@WebFilter("/app/*")
public class AuthFilter implements Filter {
    private UserService userService;
    private final Key secretKey = JwtUtil.SECRET_KEY;
    private final Gson gson = new GsonBuilder().create();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        ServletContext servletContext = filterConfig.getServletContext();
        this.userService = UserService.getInstance(servletContext);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token de autenticação ausente ou mal formatado.");            return;
        }

        try {
            String token = authHeader.substring(7);

            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseSignedClaims(token);

            Long userId = Long.parseLong(claims.getBody().getSubject());

            User usuario = userService.buscarUsuarioById(userId).orElseThrow(() -> new JwtException("Usuario do token não encontrado no banco"));

            request.setAttribute("usuarioLogado", usuario);

            String roleStr = claims.getBody().get("role", String.class);
            Role role = Role.valueOf(roleStr);

            String path = request.getRequestURI().substring(request.getContextPath().length());

            if (role == Role.MANAGER) {
                filterChain.doFilter(request, response);
                return;
            }

            if (role == Role.EMPLOYEE) {
                if (path.startsWith("/app/funcionario") || path.startsWith("/app/pedidos")) {
                    filterChain.doFilter(request, response);
                    return;
                } else {
                    sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: você não tem permissão de Gerente.");
                    return;
                }
            }

            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Papel (Role) desconhecido.");
            return;
        } catch (JwtException e) {
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou expirado. Faça login novamente.");
            return;
        } catch (IllegalArgumentException e) {
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Houve um erro de illegalArgument : " + e.getMessage() + "\n" + e.getStackTrace());

        }
    }

    private void sendJsonError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonError = gson.toJson(Map.of("erro", message));
        response.getWriter().write(jsonError);
    }

    @Override
    public void destroy() {
    }
}
