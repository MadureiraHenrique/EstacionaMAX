package Controller;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entities.Employee;
import entities.Manager;
import entities.User;
import enums.Role;
import enums.Shift;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.UserService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import Exception.BusinessException;

@WebServlet("/app/funcionarios")
public class FuncionarioServlet extends HttpServlet {
    private UserService userService;
    private Gson gson;
    LocalDateTimeAdapter localDateTimeAdapter;

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        this.userService = UserService.getInstance(servletContext);
        this.localDateTimeAdapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, localDateTimeAdapter)
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            List<User> funcionarios = userService.buscarTodosOsFuncionarios();

            sendJsonResponse(resp, HttpServletResponse.SC_OK, funcionarios);

        } catch (Exception e) {
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao buscar funcionários: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isGerente(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Parâmetro 'action' (criar, atualizar, deletar) é obrigatório.");
            return;
        }

        try {
            switch (action) {
                case "criar":
                    criarFuncionario(request, response);
                    break;
                case "atualizar":
                    atualizarFuncionario(request, response);
                    break;
                case "deletar":
                    deletarFuncionario(request, response);
                    break;
                default:
                    sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Ação inválida.");
                    break;
            }
        } catch (BusinessException e) {
            sendJsonError(response, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (Exception e) {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro interno: " + e.getMessage());
        }
    }

    private boolean isGerente(HttpServletRequest request) {
        User usuario = (User) request.getAttribute("usuarioLogado");
        return usuario != null && usuario instanceof Manager;
    }

    private void sendJsonError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonError = gson.toJson(Map.of("erro", message));
        response.getWriter().write(jsonError);
    }

    private void sendJsonResponse(HttpServletResponse response, int status, Object data) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = gson.toJson(data);
        response.getWriter().write(jsonResponse);
    }

    private void criarFuncionario(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException {

        String nome = request.getParameter("nome");
        String cpf = request.getParameter("cpf");
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        String telefone = request.getParameter("telefone");
        Shift turno = Shift.valueOf(request.getParameter("turno"));

        User gerenteLogado = (User) request.getAttribute("usuarioLogado");

        User novoFuncionario = (User) userService.criarFuncionario(nome, cpf, email, telefone, senha, turno, gerenteLogado.getId());

        sendJsonResponse(response, HttpServletResponse.SC_CREATED, novoFuncionario);
    }

    private void atualizarFuncionario(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException {

        Long id = Long.parseLong(request.getParameter("id"));

        String nome = request.getParameter("nome");
        String cpf = request.getParameter("cpf");
        String email = request.getParameter("email");
        String telefone = request.getParameter("telefone");
        Shift turno = Shift.valueOf(request.getParameter("turno"));

        Employee funcionario = userService.buscarFuncionarioById(id)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o funcionario de id: " + id));

        funcionario.setName(nome);
        funcionario.setCpf(cpf);
        funcionario.setEmail(email);
        funcionario.setTelephone(telefone);
        funcionario.setShift(turno);

        userService.atualizarUsuario(funcionario);

        sendJsonResponse(response, HttpServletResponse.SC_OK, funcionario);
    }

    private void deletarFuncionario(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException {

        Long id = Long.parseLong(request.getParameter("id"));
        userService.deletarUsuarioById(id);

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}
