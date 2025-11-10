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
import entities.User;
import entities.Vehicle;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import services.VehicleService;

import Exception.BusinessException;

@WebServlet("/app/veiculos")
public class VehicleServlet extends HttpServlet {

    private VehicleService vehicleService;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        ServletContext context = getServletContext();
        this.vehicleService = VehicleService.getInstance(context);

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
            Long veiculoId = Long.parseLong(request.getParameter("veiculoId"));
            if (veiculoId != null) {
                Vehicle veiculo = vehicleService.buscarVeiculoById(veiculoId)
                        .orElseThrow(() -> new BusinessException("Não é possivel encontrar o carro de id: " + veiculoId));
                sendJsonResponse(response, HttpServletResponse.SC_OK, veiculo);
                return;
            }
            List<Vehicle> veiculos = vehicleService.listarTodosVeiculos();
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("veiculos", veiculos);
            sendJsonResponse(response, HttpServletResponse.SC_OK, resposta);
        } catch (Exception e) {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao buscar veículos: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (!isFuncionario(request)) {
            sendJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: apenas funcionários podem modificar veículos.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null || !action.equals("atualizar")) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "Parâmetro 'action=atualizar' é obrigatório.");
            return;
        }

        try {
            atualizarVeiculo(request, response);
        } catch (BusinessException e) {
            sendJsonError(response, HttpServletResponse.SC_NOT_FOUND, e.getMessage());
        } catch (NumberFormatException e) {
            sendJsonError(response, HttpServletResponse.SC_BAD_REQUEST, "ID inválido.");
        } catch (Exception e) {
            sendJsonError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro interno: " + e.getMessage());
        }
    }

    private void atualizarVeiculo(HttpServletRequest request, HttpServletResponse response)
            throws IOException, BusinessException, NumberFormatException {

        Long id = Long.parseLong(request.getParameter("id"));

        Vehicle veiculo = vehicleService.buscarVeiculoById(id)
                .orElseThrow(() -> new BusinessException("Veículo com ID " + id + " não encontrado."));

        String cor = request.getParameter("cor");
        if (cor != null && !cor.isEmpty()) {
            veiculo.setColor(cor);
        }

        String modelo = request.getParameter("modelo");
        if (modelo != null && !modelo.isEmpty()) {
            veiculo.setModel(modelo);
        }

        String placa = request.getParameter("placa");
        if (placa != null && !placa.isEmpty()) {
            veiculo.setPlate(placa);
        }

        Vehicle veiculoAtualizado = vehicleService.atualizarVeiculo(veiculo);

        sendJsonResponse(response, HttpServletResponse.SC_OK, veiculoAtualizado);
    }

    private boolean isAutenticado(HttpServletRequest request) {
        return request.getAttribute("usuarioLogado") != null;
    }

    private boolean isFuncionario(HttpServletRequest request) {
        User usuario = (User) request.getAttribute("usuarioLogado");
        return usuario instanceof Employee;
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