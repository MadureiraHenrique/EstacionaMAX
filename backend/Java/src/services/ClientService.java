package services;

import entities.Client;
import entities.Order;
import entities.Vehicle;
import repository.ClientRepository;
import repository.OrderRepository;
import repository.VehicleRepository;
import Exception.BusinessException;

import java.util.List;
import java.util.Set;

public class ClientService {
    private static ClientService instance;

    private final ClientRepository clientRepository;
    private final VehicleRepository vehicleRepository;
    private final OrderRepository orderRepository;

    private ClientService() {
        this.clientRepository = ClientRepository.getInstance();
        this.vehicleRepository = VehicleRepository.getInstance();
        this.orderRepository = OrderRepository.getInstance();
    }

    public static ClientService getInstance() {
        if (instance == null) {
            synchronized (ClientService.class) {
                if (instance == null) {
                    instance = new ClientService();
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

        Client client = new Client();
        client.setName(nome);
        client.setEmail(email);
        client.setCpf(cpf);

        client.getCars().add(vehicle);

        return clientRepository.save(client);
    }

    public Client criarClienteComCarroCadastrado(String nome, String cpf, String email, String placa)
            throws BusinessException {
        if (clientRepository.findByCpf(cpf).isPresent()) {
            throw new BusinessException("O cpf " + cpf + " já esta cadastrado");
        }

        Vehicle vehicle = vehicleRepository.findByPlaca(placa).orElseThrow(() -> new BusinessException("O Carro de placa: " + placa + " não existe"));

        Client client = new Client();
        client.setName(nome);
        client.setEmail(email);
        client.setCpf(cpf);

        client.getCars().add(vehicle);

        return clientRepository.save(client);
    }

    public Vehicle adicionarVeiculoCliente(Long id, String model, String color, String plate)
        throws BusinessException {
        if (vehicleRepository.findByPlaca(plate).isPresent()) {
            throw new BusinessException("A placa " + plate + " já esta cadastrada");
        }

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + id));

        Vehicle vehicle = new Vehicle();
        vehicle.setModel(model);
        vehicle.setPlate(plate);
        vehicle.setColor(color);
        Vehicle veiculoSalvo = vehicleRepository.save(vehicle);

        client.getCars().add(vehicle);
        clientRepository.update(client);

        return veiculoSalvo;
    }

    public Vehicle adicionarVeiculoClienteByPlaca(Long clienteId, String placa) throws BusinessException {
        Client client = clientRepository.findById(clienteId).orElseThrow(() -> new BusinessException("O cliente de id: " + clienteId + " não existe"));

        Vehicle vehicle = vehicleRepository.findByPlaca(placa).orElseThrow(() -> new BusinessException("O Carro de placa: " + placa + " não existe"));

        client.getCars().add(vehicle);

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

    public void deletarCliente(Long id) throws BusinessException {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Não foi possivel encontrar o cliente de id: " + id));

        Set<Vehicle> veiculosCliente = vehicleRepository.findAllByClientId(id);
        List<Order> pedidosCliente = orderRepository.findAllByClienteId(id);

        boolean temPedidoAberto = pedidosCliente.stream()
                .anyMatch(pedido -> pedido.getDepartureTime() == null);

        if (temPedidoAberto) {
            throw new BusinessException("O cliente de id " + id + " tem pedidos em aberto");
        }

        for (Vehicle vehicle : veiculosCliente) {
            vehicleRepository.deleteById(vehicle.getId());
        }

        for (Order pedido : pedidosCliente) {
            orderRepository.deleteById(pedido.getId());
        }

        clientRepository.deleteById(id);
    }

    public List<Client> listarTodosOsClientes() {
        return clientRepository.findAll();
    }
}
