package services;

import java.util.List;
import java.util.Optional;

import entities.Client;
import entities.Vehicle;
import jakarta.servlet.ServletContext;
import repository.ClientRepository;
import repository.OrderRepository;
import repository.VehicleRepository;

import Exception.BusinessException;

public class VehicleService {

    private static VehicleService instance;
    private final VehicleRepository vehicleRepository;
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;

    private VehicleService(ServletContext context) {
        this.vehicleRepository = VehicleRepository.getInstance(context);
        this.orderRepository = OrderRepository.getInstance(context);
        this.clientRepository = ClientRepository.getInstance(context);
    }

    public static VehicleService getInstance(ServletContext context) {
        if (instance == null) {
            synchronized (VehicleService.class) {
                if (instance == null) {
                    instance = new VehicleService(context);
                }
            }
        }
        return instance;
    }

    public Vehicle atualizarVeiculo(Vehicle vehicleParaAtualizar) throws BusinessException {
        if (vehicleParaAtualizar.getId() == null) {
            throw new BusinessException("ID do veículo não pode ser nulo para atualização.");
        }

        Vehicle veiculoExistente = vehicleRepository.findById(vehicleParaAtualizar.getId())
                .orElseThrow(() -> new BusinessException("Veículo com ID " + vehicleParaAtualizar.getId() + " não encontrado."));

        if (!veiculoExistente.getPlate().equals(vehicleParaAtualizar.getPlate())) {
            throw new BusinessException("Não é permitido alterar a placa de um veículo.");
        }

        veiculoExistente.setModel(vehicleParaAtualizar.getModel());
        veiculoExistente.setColor(vehicleParaAtualizar.getColor());

        return vehicleRepository.update(veiculoExistente);
    }

    public void deletarVeiculoById(Long id) throws BusinessException {
        Vehicle veiculo = vehicleRepository.findById(id).orElseThrow(() -> new BusinessException("O veiculo de id: " + id + " não pode ser encontrado"));

        vehicleRepository.deleteById(id);
    }

    public Optional<Vehicle> buscarVeiculoPorPlaca(String placa) {
        return vehicleRepository.findByPlaca(placa);
    }

    public List<Vehicle> listarTodosVeiculos() {
        return vehicleRepository.findAll();
    }
}