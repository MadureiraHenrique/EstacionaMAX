package entities;

import enums.Shift;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Manager extends User {

    public Manager() {};

    public Manager(Long id, String name, String cpf, String email, String telephone, String password, LocalDateTime entryTime, LocalDateTime departureTime, Shift shift) {
        super(id, name, cpf, email, telephone, password, entryTime, departureTime);
    }
}
