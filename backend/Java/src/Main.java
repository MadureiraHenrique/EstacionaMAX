import entities.*;
import enums.Shift;
import repository.UserRepository;
import services.ClientService;
import services.OrderService;

import java.time.LocalDateTime;

import Exception.BusinessException;
import services.UserService;

public class Main {
    public static void main(String[] args) {
        ClientService clientService = ClientService.getInstance();
        OrderService orderService = OrderService.getInstance();
        UserService userService = UserService.getInstance();

        try {
            clientService.criarCliente("test", "123.456.789.10", "test@gmail.com", "123456789", "peugeot", "white");
            clientService.adicionarVeiculoCliente(1L, "Ferrari", "black", "1MTH3B3ST");
            clientService.criarClienteComCarroCadastrado("test", "123.456.100.10", "test@gmail.com", "123456789");

            userService.criarGerente("Gerente", "123.456.789-10", "gerente@gmail.com", "123456789", "gerente1234", Shift.MORNING);

            Employee funcionario = new Employee();
            funcionario.setShift(Shift.MORNING);
            funcionario.setCpf("123.456.789-00");
            funcionario.setDepartureTime(LocalDateTime.now().plusHours(8));
            funcionario.setEmail("teste@exemplo.com");
            funcionario.setEntryTime(LocalDateTime.now());
            funcionario.setName("Nome de Teste");
            funcionario.setPassword("senha123");
            funcionario.setTelephone("99999-8888");

            orderService.registrarEntrada(1L, 1L, "123456789");
            orderService.registrarSaida(1L, 1L, "123456789", 1L);
        } catch (BusinessException e) {
            System.out.println("error " + e.getMessage());
        }
    }
}
