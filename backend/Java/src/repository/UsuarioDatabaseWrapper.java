package repository;

import entities.Employee;
import entities.Manager;

import java.util.Map;

public class UsuarioDatabaseWrapper {
    Map<Long, Manager> managers;
    Map<Long, Employee> employees;
}
