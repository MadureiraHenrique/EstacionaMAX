//import entities.*;
//import enums.Shift;
//import repository.UserRepository;
//import services.ClientService;
//import services.OrderService;
//
//import java.time.LocalDateTime;
//
//import Exception.BusinessException;
//import Exception.AuthException;
//import services.UserService;
//
//public class Main {
//    public static void main(String[] args) {
//        ClientService clientService = ClientService.getInstance();
//        OrderService orderService = OrderService.getInstance();
//        UserService userService = UserService.getInstance();
//
//        try {
//            User usuario = userService.login("gerente@gmail.com", "gerente1234");
//            System.out.println(usuario.getName());
////            clientService.criarCliente("test", "123.456.789.10", "test@gmail.com", "123456789", "peugeot", "white");
////            clientService.adicionarVeiculoCliente(1L, "Ferrari", "black", "1MTH3B3ST");
////            clientService.criarClienteComCarroCadastrado("test", "123.456.100.10", "test@gmail.com", "123456789");
////
////            userService.criarGerente("Gerente", "123.456.789-11", "gerente@gmail.com", "123456789", "gerente1234", Shift.MORNING);
////            System.out.println();
////            userService.criarFuncionario("Funcionario", "123.456.789-10", "funcionario@gmail.com", "12341234", "funcionario12345", Shift.MORNING, 1L);
//          } catch (AuthException e) {
//            System.out.println("error " + e.getMessage());
//        }
//    }
//}
