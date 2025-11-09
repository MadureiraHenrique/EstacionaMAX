package repository;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entities.Employee;
import entities.Manager;
import entities.User;

import jakarta.servlet.ServletContext;
import java.io.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserRepository extends AbstractRepository<User> {

    private static UserRepository instance;

    private final Map<Long, Manager> managersDB;
    private final Map<Long, Employee> employeesDB;

    private final Gson gson;

    private UserRepository(ServletContext context) {
        super(context.getRealPath("/WEB-INF/usuarios.json"));

        this.managersDB = new ConcurrentHashMap<>();
        this.employeesDB = new ConcurrentHashMap<>();

        LocalDateTimeAdapter adapter = new LocalDateTimeAdapter();

        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();

        loadFromFile();
    }

    public static UserRepository getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (UserRepository.class) {
                if (instance == null) {
                    instance = new UserRepository(servletContext);
                }
            }
        }
        return instance;
    }

    @Override
    protected void loadFromFile() {
        try (Reader reader = new FileReader(fullPath)) {
            UsuarioDatabaseWrapper wrapper = gson.fromJson(reader, UsuarioDatabaseWrapper.class);

            if (wrapper != null) {
                if (wrapper.managers != null) {
                    managersDB.putAll(wrapper.managers);
                }
                if (wrapper.employees != null) {
                    employeesDB.putAll(wrapper.employees);
                }

                long maxManagerId = managersDB.keySet().stream().max(Long::compare).orElse(0L);
                long maxFuncId = employeesDB.keySet().stream().max(Long::compare).orElse(0L);
                nextId.set(Math.max(maxManagerId, maxFuncId) + 1);
            }
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    @Override
    protected void persistMapToFile() {
        UsuarioDatabaseWrapper wrapper = new UsuarioDatabaseWrapper();
        wrapper.managers = this.managersDB;
        wrapper.employees = this.employeesDB;

        try (Writer writer = new FileWriter(fullPath)) {
            gson.toJson(wrapper, writer);
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    @Override
    public synchronized User save(User usuario) {
        usuario.setId(nextId.getAndIncrement());

        if (usuario instanceof Manager) {
            managersDB.put(usuario.getId(), (Manager) usuario);
        } else if (usuario instanceof Employee) {
            employeesDB.put(usuario.getId(), (Employee) usuario);
        }

        persistMapToFile();
        return usuario;
    }

    @Override
    public synchronized User update(User usuario) {
        if (usuario.getId() == null) throw new IllegalArgumentException("ID nulo.");

        if (usuario instanceof Manager) {
            if (!managersDB.containsKey(usuario.getId())) throw new IllegalArgumentException("Manager não existe.");
            managersDB.put(usuario.getId(), (Manager) usuario);
        } else if (usuario instanceof Employee) {
            if (!employeesDB.containsKey(usuario.getId())) throw new IllegalArgumentException("Funcionário não existe.");
            employeesDB.put(usuario.getId(), (Employee) usuario);
        }

        persistMapToFile();
        return usuario;
    }

    @Override
    public synchronized void deleteById(Long id) {
        managersDB.remove(id);
        employeesDB.remove(id);
        persistMapToFile();
    }

    @Override
    public Optional<User> findById(Long id) {
        if (managersDB.containsKey(id)) {
            return Optional.of(managersDB.get(id));
        }
        return Optional.ofNullable(employeesDB.get(id));
    }

    @Override
    public List<User> findAll() {
        return Stream.concat(managersDB.values().stream(), employeesDB.values().stream())
                .collect(Collectors.toList());
    }

    public Optional<User> findByEmail(String email) {
        Optional<Manager> manager = managersDB.values().stream()
                .filter(g -> g.getEmail().equalsIgnoreCase(email))
                .findFirst();
        if (manager.isPresent()) return manager.map(g -> g);

        Optional<Employee> employee = employeesDB.values().stream()
                .filter(f -> f.getEmail().equalsIgnoreCase(email))
                .findFirst();
        return employee.map(f -> f);
    }

    public Optional<Employee> findFuncionarioById(Long id) {
        return employeesDB.values().stream()
                .filter(e -> e.getId().equals(id))
                .findFirst();
    }

    public Optional<User> findByCpf(String cpf) {
        Optional<Manager> manager = managersDB.values().stream()
                .filter(g -> g.getCpf().equalsIgnoreCase(cpf))
                .findFirst();
        if (manager.isPresent()) return manager.map(g -> g);

        Optional<Employee> employee = employeesDB.values().stream()
                .filter(f -> f.getCpf().equalsIgnoreCase(cpf))
                .findFirst();
        return employee.map(f -> f);
    }

    public List<User> findAllEmployees() {
        return new ArrayList<>(employeesDB.values());
    }

    public List<User> findAllManagers() {
        return new ArrayList<>(managersDB.values());
    }
}
