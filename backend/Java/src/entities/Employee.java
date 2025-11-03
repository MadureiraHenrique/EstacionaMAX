package entities;

import enums.Shift;

import java.time.LocalDateTime;

public class Employee extends User{

    private Manager manager;

    private Shift shift;

    public Employee() {}

    public Employee(Long id, String name, String cpf, String email, String telephone, String password, LocalDateTime entryTime, LocalDateTime departureTime, Manager manager, Shift shift) {
        super(id, name, cpf, email, telephone, password, entryTime, departureTime);
        this.manager = manager;
        this.shift = shift;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }
}
