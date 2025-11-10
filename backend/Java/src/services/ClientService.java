package services;

import entities.Client;
import entities.Order;
import entities.Vehicle;
import jakarta.servlet.ServletContext;
import repository.ClientRepository;
import repository.OrderRepository;
import repository.VehicleRepository;
import Exception.BusinessException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class ClientService {
    private static ClientService instance;

    private final ClientRepository clientRepository;
    private final VehicleRepository vehicleRepository;
    private final OrderRepository orderRepository;

    private ClientService(ServletContext servletContext) {
            this.clientRepository = ClientRepository.getInstance(servletContext);
            this.vehicleRepository = VehicleRepository.getInstance(servletContext);
            this.orderRepository = OrderRepository.getInstance(servletContext);
    }

    public static ClientService getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (ClientService.class) {
                if (instance == null) {
                    instance = new ClientService(servletContext);
                }
            }
        }
        return instance;
    }

    public Client criarCliente(String nome, String cpf, String email, String placa, String modelo, String cor)
            throws BusinessException {
        if (clientRepository.findByCpf(cpf).isPresent()) {
            throw new BusinessException("O cpf " + cpf + " já esta cadastrado");
        }

        Client client = new Client();
        client.setName(nome);
        client.setEmail(email);
        client.setCpf(cpf);

        Client clienteCriado = clientRepository.save(client);

        Vehicle vehicle;

        if (vehicleRepository.findByPlaca(placa).isEmpty()) {
            vehicle = new Vehicle();
            vehicle.setPlate(placa);
            vehicle.setColor(cor);
            vehicle.setModel(modelo);
            Vehicle veiculoSalvo = vehicleRepository.save(vehicle);
        } else {
            vehicle = vehicleRepository.findByPlaca(placa).orElseThrow(() -> new BusinessException("O Carro de placa: " + placa + " não existe"));
        }

        vehicle.getClienteIds().add(clienteCriado.getId());
        vehicleRepository.update(vehicle);
        return clienteCriado;
    }

    public Vehicle adicionarVeiculoCliente(Long clienteId, String model, String color, String plate)
        throws BusinessException {
        Client client = clientRepository.findById(clienteId)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + clienteId));

        Optional<Vehicle> carroExistente = vehicleRepository.findByPlaca(plate);

        Vehicle vehicle;

        if (carroExistente.isPresent()) {
            vehicle = carroExistente.get();
        } else {
            vehicle = new Vehicle();
            vehicle.setModel(model);
            vehicle.setPlate(plate);
            vehicle.setColor(color);
            vehicle = vehicleRepository.save(vehicle);
        }

        vehicle.getClienteIds().add(clienteId);

        return vehicle;
    }

    public Client atualizarCliente(Client client) throws BusinessException {
        if (client.getId() == null) {
            throw new BusinessException("O cliente não possui id");
        }

        if (clientRepository.findById(client.getId()).isEmpty()) {
            throw new BusinessException("Não foi possivel encontrar o cliente de id: " + client.getId());
        }

        return clientRepository.update(client);
    }

    public List<Client> listarClientesByVeiculoId(Long id) throws BusinessException {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Carro com ID " + id + " não encontrado."));

        Set<Long> idsClientes = vehicle.getClienteIds();

        if (idsClientes == null || idsClientes.isEmpty()) {
            return new ArrayList<>();
        }

        return clientRepository.findAllByIds(idsClientes);
    }

    public void deletarCliente(Long id) throws BusinessException {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + id));

        List<Order> pedidosCliente = orderRepository.findAllByClienteId(id);

        boolean temPedidoAberto = pedidosCliente.stream()
                .anyMatch(pedido -> pedido.getDepartureTime() == null);

        if (temPedidoAberto) {
            throw new BusinessException("O cliente de id " + id + " tem pedidos em aberto");
        }

        for (Order pedido : pedidosCliente) {
            orderRepository.deleteById(pedido.getId());
        }

        clientRepository.deleteById(id);
    }

    public Optional<Client> buscarClienteById(Long id) {
        return clientRepository.findById(id);
    }

    public List<Client> listarTodosOsClientes() {
        return clientRepository.findAll();
    }
}
