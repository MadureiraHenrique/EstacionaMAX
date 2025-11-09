package Controller;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import entities.Employee;
import entities.Order;
import entities.User;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.OrderService;

import Exception.BusinessException;

@WebServlet("/app/pedidos")
public class PedidoServlet extends HttpServlet {

    private OrderService pedidoService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        ServletContext context = getServletContext();
        this.pedidoService = OrderService.getInstance(context);

        LocalDateTimeAdapter adapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isAutenticado(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado.");
            return;
        }

        try {
            List<Order> pedidos = pedidoService.findAllPedidosEmAberto();
            sendJsonResponse(response, HttpServletResponse.SC_OK, pedidos);
        } catch (Exception e) {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao buscar pedidos: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isFuncionario(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: apenas funcionários podem registrar E/S.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Parâmetro 'action' (entrada, saida) é obrigatório.");
            return;
        }

        try {
            switch (action) {
                case "entrada":
                    registrarEntrada(request, response);
                    break;
                case "saida":
                    registrarSaida(request, response);
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

    private void registrarEntrada(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException, NumberFormatException {

        Long clienteId = Long.parseLong(request.getParameter("id"));
        String placa = request.getParameter("placa");
        Employee funcionarioLogado = (Employee) request.getAttribute("usuarioLogado");

        Order novoPedido = pedidoService.registrarEntrada(clienteId, funcionarioLogado.getId(), placa);

        sendJsonResponse(response, HttpServletResponse.SC_CREATED, novoPedido);
    }

    private void registrarSaida(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException, NumberFormatException {

        Long pedidoId = Long.parseLong(request.getParameter("pedidoId"));
        Order pedido = pedidoService.buscarPedidoById(pedidoId)
                .orElseThrow(() -> new BusinessException("Não é possivel encontrar o pedido de id: " + pedidoId));
        Order pedidoFechado = pedidoService.registrarSaida(pedidoId);

        sendJsonResponse(response, HttpServletResponse.SC_OK, pedidoFechado);
    }

    private boolean isAutenticado(HttpServletRequest request) {
        return request.getAttribute("usuarioLogado") != null;
    }

    private boolean isFuncionario(HttpServletRequest request) {
        User usuario = (User) request.getAttribute("usuarioLogado");
        return usuario != null && usuario instanceof Employee;
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