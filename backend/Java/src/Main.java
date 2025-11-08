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

            userService.criarGerente("Gerente", "123.456.789-11", "gerente@gmail.com", "123456789", "gerente1234", Shift.MORNING);
            System.out.println();
            userService.criarFuncionario("Funcionario", "123.456.789-10", "funcionario@gmail.com", "12341234", "funcionario12345", Shift.MORNING, 1L);
            userService.deletarUsuarioById(2L);
        } catch (BusinessException e) {
            System.out.println("error " + e.getMessage());
        }
    }
}
