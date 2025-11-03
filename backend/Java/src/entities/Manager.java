package entities;

import enums.Shift;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Manager extends User {

    private Set<Employee> managedEmployees = new HashSet<>();
    private List<Report> requestedReports = new ArrayList<>();

    private Shift  shift;

    public Manager() {};

    public Manager(Long id, String name, String cpf, String email, String telephone, String password, LocalDateTime entryTime, LocalDateTime departureTime, Shift shift) {
        super(id, name, cpf, email, telephone, password, entryTime, departureTime);
        this.shift = shift;
    }

    public Set<Employee> getManagedEmployees() {
        return managedEmployees;
    }

    public List<Report> getRequestedReports() {
        return requestedReports;
    }

    public Shift getShift() {
        return shift;
    }

    public void setShift(Shift shift) {
        this.shift = shift;
    }
}
