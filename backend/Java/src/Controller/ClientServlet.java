package Controller;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entities.Client;
import entities.Employee;
import entities.User;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.ClientService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import Exception.BusinessException;

@WebServlet("/app/cliente")
public class ClientServlet extends HttpServlet {
    private ClientService clientService;
    private Gson gson;
    LocalDateTimeAdapter localDateTimeAdapter;

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        this.clientService = ClientService.getInstance(servletContext);
        localDateTimeAdapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, localDateTimeAdapter)
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User usuario = (User) req.getAttribute("usuarioLogado");

        if (usuario == null) {
            sendJsonError(resp, HttpServletResponse.SC_FORBIDDEN, "Acesso não autorizado");
            return;
        }

        try {
            Map<String, Object> wrapper = new HashMap<>();
            List<Client> clientes = clientService.listarTodosOsClientes();
            wrapper.put("clientes", clientes);
            sendJsonResponse(resp, HttpServletResponse.SC_OK, wrapper);
        } catch (IOException e) {
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Não foi possivel listar os clientes: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        if (!isFuncionario(req)) {
//            sendJsonError(resp, HttpServletResponse.SC_FORBIDDEN, "Acesso não autorizado");
//            return;
//        }

        String action = req.getParameter("action");
        if (action == null) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "O parametro action é obrigatorio");
            return;
        }

        try {
            switch (action) {
                case "criar":
                    criarCliente(req, resp);
                    break;
                case "atualizar":
                    atualizarCliente(req, resp);
                    break;
                case "deletar":
                    deletarCliente(req, resp);
                    break;
                default:
                    sendJsonResponse(resp, HttpServletResponse.SC_BAD_REQUEST, "Ação invalida");
                    break;

            }
        } catch (BusinessException e) {
            sendJsonError(resp, HttpServletResponse.SC_CONFLICT, e.getMessage()); // 409 Conflict
        } catch (Exception e) {
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro interno: " + e.getMessage());
        }
    }

    public void criarCliente(HttpServletRequest req, HttpServletResponse resp) throws IOException, BusinessException {
        String nome = req.getParameter("nome");
        String cpf = req.getParameter("cpf");
        String email = req.getParameter("email");

        String placa = req.getParameter("placa");
        String modelo = req.getParameter("modelo");
        String cor = req.getParameter("cor");

        Client client = clientService.criarCliente(nome, cpf, email, placa, modelo, cor);

        sendJsonResponse(resp, HttpServletResponse.SC_OK, client);
    }

    public void atualizarCliente(HttpServletRequest req, HttpServletResponse resp) throws IOException, BusinessException {
        Long id = Long.parseLong(req.getParameter("id"));
        String nome = req.getParameter("nome");
        String email = req.getParameter("email");
        String cpf = req.getParameter("cpf");

        Client client = clientService.buscarClienteById(id)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + id));

        client.setName(nome);
        client.setEmail(email);
        client.setCpf(cpf);

        Client clientAtualizado = clientService.atualizarCliente(client);

        sendJsonResponse(resp, HttpServletResponse.SC_OK, clientAtualizado);
    }

    public void deletarCliente(HttpServletRequest req, HttpServletResponse resp) throws IOException, BusinessException {
        Long id = Long.parseLong(req.getParameter("id"));
        clientService.deletarCliente(id);

        sendJsonResponse(resp, HttpServletResponse.SC_OK, "");
    }

    public boolean isFuncionario(HttpServletRequest req) {
        User usuario = (User) req.getAttribute("usuarioLogado");
        return usuario instanceof Employee;
    }

    public void sendJsonError(HttpServletResponse resp, int status, String message) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        String jsonStr = gson.toJson("error: " + message);
        resp.getWriter().write(jsonStr);
    }

    public void sendJsonResponse(HttpServletResponse resp, int status, Object data) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        String jsonStr = gson.toJson(data);
        resp.getWriter().write(jsonStr);
    }
}
