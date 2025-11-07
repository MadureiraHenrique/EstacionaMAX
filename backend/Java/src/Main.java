import entities.*;
import enums.Shift;
import repository.ClientRepository;
import repository.OrderRepository;
import repository.UserRepository;
import repository.VehicleRepository;
import services.ClientService;
import services.OrderService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        Client client = new Client();
        Manager manager = new Manager();
        Order order = new Order();
        Vehicle vehicle = new Vehicle();
        Employee employee = new Employee();

        client.setName("test");
        client.setCpf("123.123.123-56");
        client.setEmail("test@gmail.com");

        vehicle.setModel("car");
        vehicle.setColor("black");
        vehicle.setPlate("12345");

        Long id = 1L;
        String name = "Ana Silva";
        String email = "ana.silva@empresa.com";
        String cpf = "123.456.789-00";
        String telephone = "71999998888";
        String password = "senhaSuperSegura123";
        Shift shift = Shift.MORNING;
        LocalDateTime entryTime = LocalDateTime.of(2025, 11, 6, 8, 0, 0); // 6/Nov/2025 08:00
        LocalDateTime departureTime = LocalDateTime.of(2025, 11, 6, 17, 0, 0); // 6/Nov/2025 17:00

        employee.setId(id);
        employee.setName(name);
        employee.setEmail(email);
        employee.setCpf(cpf);
        employee.setTelephone(telephone);
        employee.setPassword(password);
        employee.setShift(shift);
        employee.setEntryTime(entryTime);
        employee.setDepartureTime(departureTime);

        manager.setId(id);
        manager.setName(name);
        manager.setEmail(email);
        manager.setCpf(cpf);
        manager.setTelephone(telephone);
        manager.setPassword(password);
        manager.setShift(shift);
        manager.setEntryTime(entryTime);
        manager.setDepartureTime(departureTime);

        order.setEmployee(employee);
        order.setCar(vehicle);
        order.setValue(BigDecimal.valueOf(10));
        order.setParkingSpace(1);
        order.setEntryTime(entryTime);
        order.setDepartureTime(departureTime);

        ClientRepository clientRepository = ClientRepository.getInstance();
        UserRepository userRepository = UserRepository.getInstance();
        OrderRepository orderRepository = OrderRepository.getInstance();
        VehicleRepository vehicleRepository = VehicleRepository.getInstance();

        clientRepository.save(client);
        userRepository.save(employee);
        userRepository.save(manager);
        orderRepository.save(order);
        vehicleRepository.save(vehicle);
    }
}
