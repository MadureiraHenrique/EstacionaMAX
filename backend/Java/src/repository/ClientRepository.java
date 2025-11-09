package repository;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import entities.Client;
import entities.Vehicle;
import jakarta.servlet.ServletContext;

import java.io.*;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class ClientRepository extends AbstractRepository<Client> {

    private static ClientRepository instance;

    private final Gson gson;
    private final Type typeToken;
    LocalDateTimeAdapter adapter;

    public ClientRepository(ServletContext servletContext) {
        super(servletContext.getRealPath("/WEB-INF/clientes.json"));

        this.adapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
        this.typeToken = new TypeToken<Map<Long, Client>>() {}.getType();

        loadFromFile();
    }

    public static ClientRepository getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (ClientRepository.class) {
                if (instance == null) {
                    instance = new ClientRepository(servletContext);
                }
            }
        }
        return instance;
    }

    @Override
    protected void loadFromFile() {
        try (Reader reader = new FileReader(String.valueOf(fullPath))) {
            Map<Long, Client> loadedMap = gson.fromJson(reader, typeToken);

            if (loadedMap != null) {
                database.putAll(loadedMap);
                long maxId = loadedMap.keySet().stream().max(Long::compare).orElse(0L);
                nextId.set(maxId + 1);
            }
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    @Override
    protected void persistMapToFile() {
        try (Writer writer = new FileWriter(String.valueOf(fullPath))) {
            gson.toJson(database, typeToken, writer);
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    public List<Client> findAllByIds(Set<Long> ids) {
        return database.values()
                .stream()
                .filter(c -> ids.contains(c.getId()))
                .toList();
    }

    public Optional<Client> findByCpf(String cpf) {
        return database.values()
                .stream()
                .filter(cliente -> cliente.getCpf().equals(cpf))
                .findFirst();
    }

    public List<Client> findByNomeContaining(String s) {
        return database.values()
                .stream()
                .filter(client -> client.getName().contains(s))
                .collect(Collectors.toList());
    }
}
