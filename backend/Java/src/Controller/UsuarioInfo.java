package Controller;

import entities.Manager;
import entities.User;
import enums.Role;

public class UsuarioInfo {
    private Long id;
    private String nome;
    private Role role;

    public UsuarioInfo(User usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getName();
        this.role = (usuario instanceof Manager) ? Role.MANAGER : Role.EMPLOYEE;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
