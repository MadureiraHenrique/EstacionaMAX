package entities;

import enums.Shift;

import java.time.LocalDateTime;

public class Employee extends User {

    private Manager manager;

    public Employee() {}

    public Employee(Long id, String name, String cpf, String email, String telephone, String password, LocalDateTime entryTime, LocalDateTime departureTime, Manager manager, Shift shift) {
        super(id, name, cpf, email, telephone, password, entryTime, departureTime);
        this.manager = manager;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }
}
