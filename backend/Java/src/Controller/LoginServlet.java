package Controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entities.Manager;
import entities.User;
import enums.Role;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.UserService;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

import Exception.AuthException;
import util.JwtUtil;
import util.LoginResponse;
import util.UsuarioInfo;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private UserService userService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        this.userService = UserService.getInstance(servletContext);
        this.gson = new GsonBuilder().create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "Use somente o metodo POST para realizar login");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String email = req.getParameter("email");
        String password = req.getParameter("senha");

        try {
            User usuario = userService.login(email, password);

            String token = generateJwtToken(usuario);

            LoginResponse loginResponse = new LoginResponse(token, new UsuarioInfo(usuario));
            String jsonResponse = gson.toJson(loginResponse);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(jsonResponse);
        } catch (AuthException e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");

            String jsonError = gson.toJson(Map.of("error: ", e.getMessage()));
            resp.getWriter().write(jsonError);
        }
    }

    private String generateJwtToken(User usuario) {
        Instant agora = Instant.now();

        Role role = (usuario instanceof Manager) ? Role.MANAGER : Role.EMPLOYEE;

        Instant expiracao = agora.plus(8, ChronoUnit.HOURS);
        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("nome", usuario.getName())
                .claim("role", role.toString())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(expiracao))
                .signWith(JwtUtil.SECRET_KEY)
                .compact();
    }

    @Override
    public void destroy() {
    }
}
