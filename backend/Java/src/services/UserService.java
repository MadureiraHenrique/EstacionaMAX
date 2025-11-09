package services;

import entities.Employee;
import entities.Manager;
import entities.User;
import enums.Shift;
import jakarta.servlet.ServletContext;
import repository.UserRepository;
import Exception.AuthException;
import Exception.BusinessException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class UserService {
    public static UserService instance;

    private final UserRepository userRepository;

    private UserService(ServletContext servletContext) {
        this.userRepository = UserRepository.getInstance(servletContext);
    }

    public static UserService getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (UserService.class) {
                if (instance == null) {
                    instance = new UserService(servletContext);
                }
            }
        }
        return instance;
    }

    public User login(String email, String senha) throws AuthException {
        User usuario = userRepository.findByEmail(email).orElseThrow(() -> new AuthException("Não foi possivel encontrar nenhum usuario com o email: " + email));

        if (!usuario.getPassword().equals(senha)) {
            throw new AuthException("Senha Incorreta");
        }

        return usuario;
    }

    public User criarFuncionario(String nome, String cpf, String email, String telefone, String senha, Shift turno, Long gerenteId) throws BusinessException {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("O email: " + email + " já existe");
        }

        if (userRepository.findByCpf(cpf).isPresent()) {
            throw new BusinessException("O cpf: " + cpf + " já existe");
        }

        Employee funcionario = new Employee();
        funcionario.setName(nome);
        funcionario.setCpf(cpf);
        funcionario.setEmail(email);
        funcionario.setTelephone(telefone);
        funcionario.setPassword(senha);
        funcionario.setShift(turno);
        funcionario.setManager((Manager) userRepository.findById(gerenteId).orElseThrow(() -> new BusinessException("Não existe gerente de id: " + gerenteId)));
        definirHorario(funcionario);

        return userRepository.save(funcionario);
    }

    public User criarGerente(String nome, String cpf, String email, String telefone, String senha, Shift turno) throws BusinessException {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("O email: " + email + " já existe");
        }

        if (userRepository.findByCpf(cpf).isPresent()) {
            throw new BusinessException("O cpf: " + cpf + " já existe");
        }

        Manager gerente = new Manager();
        gerente.setName(nome);
        gerente.setCpf(cpf);
        gerente.setEmail(email);
        gerente.setTelephone(telefone);
        gerente.setPassword(senha);
        gerente.setShift(turno);
        definirHorario(gerente);

        return userRepository.save(gerente);
    }

    public User atualizarUsuario(User user) throws BusinessException {
        if (user.getId() == null) {
            throw new BusinessException("O funcionario não existe");
        }
        definirHorario(user);
        return userRepository.update(user);
    }

    public void deletarUsuarioById(Long id) throws BusinessException {
        User usuario = userRepository.findById(id).orElseThrow(() -> new BusinessException("O usuario de id: " + id + " não existe"));

        userRepository.deleteById(usuario.getId());
    }

    public Optional<User> buscarUsuarioById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> buscarTodosOsFuncionarios() {
        return userRepository.findAllEmployees();
    }

    public void definirHorario(User user) {
        LocalDateTime horarioManha = LocalDateTime.now()
                .withHour(6)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        LocalDateTime horarioTarde = LocalDateTime.now()
                .withHour(14)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        LocalDateTime horarioNoite = LocalDateTime.now()
                .withHour(22)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
        if (user.getShift().equals(Shift.MORNING)) {
            user.setEntryTime(horarioManha);
            user.setDepartureTime(horarioManha.plusHours(8));
        } else if (user.getShift().equals(Shift.AFTERNOON)) {
            user.setEntryTime(horarioTarde);
            user.setDepartureTime(horarioTarde.plusHours(8));
        } else {
            user.setEntryTime(horarioNoite);
            user.setDepartureTime(horarioNoite.plusHours(8));
        }
    }
}
