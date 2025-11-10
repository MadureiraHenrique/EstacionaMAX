package services;

import entities.*;
import jakarta.servlet.ServletContext;
import repository.ClientRepository;
import repository.OrderRepository;
import repository.UserRepository;
import repository.VehicleRepository;
import Exception.BusinessException;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class OrderService {
    private static OrderService instance;

    private final ClientRepository clientRepository;
    private final Parking parking;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;


    public OrderService(ServletContext servletContext) {
        this.clientRepository = ClientRepository.getInstance(servletContext);
        this.userRepository = UserRepository.getInstance(servletContext);
        this.parking = Parking.getInstance();
        this.orderRepository = OrderRepository.getInstance(servletContext);
        this.vehicleRepository = VehicleRepository.getInstance(servletContext);
    }

    public static OrderService getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (ClientService.class) {
                if (instance == null) {
                    instance = new OrderService(servletContext);
                }
            }
        }
        return instance;
    }

    public Order registrarEntrada(Long clienteId, Long funcionarioId, String placa, Integer vaga) throws BusinessException {
        Vehicle veiculo = vehicleRepository.findByPlaca(placa).orElseThrow(() -> new BusinessException("O veiculo de placa: " + placa + " não existe"));

        Employee funcionario = (Employee) userRepository.findById(funcionarioId).filter(user -> user instanceof Employee)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o funcionario de id: " + funcionarioId));

        Client client = clientRepository.findById(clienteId).orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + clienteId));

        List<Order> pedidosCliente = orderRepository.findAllByClienteId(clienteId);

        boolean pedidoAberto = pedidosCliente.stream()
                .anyMatch(p -> p.getDepartureTime() == null);

        if (pedidoAberto) {
            throw new BusinessException("O cliente de id " + clienteId + " tem um pedido em aberto");
        }

        Order order = new Order();
        order.setEntryTime(LocalDateTime.now());
        order.setParkingSpace(vaga);
        order.setClient(client);
        order.setEmployee(funcionario);
        order.setVehicle(veiculo);

        return orderRepository.save(order);
    }

    public Order registrarSaida(Long pedidoId) throws BusinessException {
        Order pedido = orderRepository.findById(pedidoId).orElseThrow(() -> new BusinessException("não existe o pedido de id: " + pedidoId));

        if (pedido.getDepartureTime() != null) {
            throw new BusinessException("O pedido de id: " + pedidoId + " já está fechado");
        }

        pedido.setDepartureTime(LocalDateTime.now());

        BigDecimal valorTotal = calcularValor(pedido);
        pedido.setValue(valorTotal);

        return orderRepository.update(pedido);
    }

    public BigDecimal calcularValor(Order pedido) {
        BigDecimal tarifaPorHora = parking.getValor();

        if (tarifaPorHora == null || tarifaPorHora.equals(BigDecimal.ZERO)) {
            tarifaPorHora = new BigDecimal("10.00");
        }

        Duration duration = Duration.between(pedido.getEntryTime(), pedido.getDepartureTime());
        long minutosTotais = duration.toMinutes();

        long horasACobrar = (long) Math.ceil(minutosTotais / 60.0);

        if (horasACobrar == 0) {
            horasACobrar = 1;
        }

        return tarifaPorHora.multiply(new BigDecimal(horasACobrar));
    }

    public List<Order> findAllPedidosEmAberto() {
        return orderRepository.findAllOpenPedidos();
    }

    public Optional<Order> buscarPedidoById(Long id) {
        return orderRepository.findById(id);
    }

}
