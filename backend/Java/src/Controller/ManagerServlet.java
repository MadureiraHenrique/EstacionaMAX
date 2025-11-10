package Controller;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import entities.Employee;
import entities.Manager;
import entities.User;
import enums.Shift;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.UserService;

import Exception.BusinessException;

@WebServlet("/app/gerente/usuarios")
public class ManagerServlet extends HttpServlet {

    private UserService usuarioService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        ServletContext context = getServletContext();
        this.usuarioService = UserService.getInstance(context);

        LocalDateTimeAdapter adapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isManager(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: apenas gerentes podem ver usuários.");
            return;
        }

        try {
            List<User> gerentes = usuarioService.buscarTodosOsGerentes();
            List<User> funcionarios = usuarioService.buscarTodosOsFuncionarios();

            String idStr = request.getParameter("id");
            if (idStr != null) {
                Long id = Long.parseLong(idStr);

                User usuario = usuarioService.buscarUsuarioById(id)
                        .orElseThrow(() -> new BusinessException("O usuario de id: " + id + " não existe."));
                sendJsonResponse(response, HttpServletResponse.SC_OK, usuario);
                return;
            }

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("gerentes", gerentes);
            resposta.put("funcionarios", funcionarios);

            sendJsonResponse(response, HttpServletResponse.SC_OK, resposta);
        } catch (Exception e) {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao buscar usuários: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isManager(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: apenas gerentes podem modificar usuários.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Parâmetro 'action' é obrigatório.");
            return;
        }

        try {
            switch (action) {
                case "criarGerente":
                    criarManager(request, response);
                    break;
                case "criarFuncionario":
                    criarFuncionario(request, response);
                    break;
                case "atualizarUser":
                    atualizarUser(request, response);
                    break;
                case "deletarUser":
                    deletarUser(request, response);
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

    private void criarManager(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException {

        String nome = request.getParameter("nome");
        String cpf = request.getParameter("cpf");
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        String telefone = request.getParameter("telefone");
        Shift turno = Shift.valueOf(request.getParameter("turno"));

        Manager novoManager = (Manager) usuarioService.criarGerente(nome, cpf, email, telefone, senha, turno);

        sendJsonResponse(response, HttpServletResponse.SC_CREATED, novoManager);
    }

    private void criarFuncionario(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException {

        String nome = request.getParameter("nome");
        String cpf = request.getParameter("cpf");
        String email = request.getParameter("email");
        String senha = request.getParameter("senha");
        String telefone = request.getParameter("telefone");
        Shift turno = Shift.valueOf(request.getParameter("turno"));

        Manager gerenteLogado = (Manager) request.getAttribute("usuarioLogado");

        Employee novoEmployee = (Employee) usuarioService.criarFuncionario(nome, cpf, email, telefone, senha, turno, gerenteLogado.getId());

        sendJsonResponse(response, HttpServletResponse.SC_CREATED, novoEmployee);
    }

    private void atualizarUser(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException, NumberFormatException {

        Long id = Long.parseLong(request.getParameter("id"));

        User usuario = usuarioService.buscarUsuarioById(id)
                .orElseThrow(() -> new BusinessException("Usuário com ID " + id + " não encontrado."));

        usuario.setName(request.getParameter("nome"));
        usuario.setCpf(request.getParameter("cpf"));
        usuario.setEmail(request.getParameter("email"));
        usuario.setTelephone(request.getParameter("telefone"));

        if (usuario instanceof Manager) {
            ((Manager) usuario).setShift(Shift.valueOf(request.getParameter("turno")));
        } else if (usuario instanceof Employee) {
            ((Employee) usuario).setShift(Shift.valueOf(request.getParameter("turno")));
        }

        User usuarioAtualizado = usuarioService.atualizarUsuario(usuario);

        sendJsonResponse(response, HttpServletResponse.SC_OK, usuarioAtualizado);
    }

    private void deletarUser(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException, NumberFormatException {

        Long id = Long.parseLong(request.getParameter("id"));
        usuarioService.deletarUsuarioById(id);

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    private boolean isManager(HttpServletRequest request) {
        User usuario = (User) request.getAttribute("usuarioLogado");
        return usuario instanceof Manager;
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
}