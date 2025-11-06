import entities.Client;
import repository.ClientRepository;

public class Main {
    public static void main(String[] args) {
        Client client = new Client();
        client.setCpf("123.456.789-10");
        client.setEmail("test@gmail.com");
        client.setName("test");

        ClientRepository clientRepository = ClientRepository.getInstance();

        clientRepository.save(client);
        Client client1 = clientRepository.findById(2L).orElseThrow();
        client1.setName("other test");
        clientRepository.update(client1);
    }
}
