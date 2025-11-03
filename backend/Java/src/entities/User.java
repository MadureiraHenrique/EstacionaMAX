package entities;

import java.time.LocalDateTime;
import java.util.Objects;

public abstract class User {

    private Long id;
    private String name;
    private String cpf;
    private String telephone;
    private String email;
    private String password;
    private LocalDateTime entryTime;
    private LocalDateTime departureTime;

    public User() {}

    public User(Long id, String name, String cpf, String email, String telephone, String password, LocalDateTime entryTime, LocalDateTime departureTime) {
        this.id = id;
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.telephone = telephone;
        this.password = password;
        this.entryTime = entryTime;
        this.departureTime = departureTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(cpf, user.cpf)
                 && Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cpf);
    }
}
