package com.sweetcrumbs.bakery.service;

import com.sweetcrumbs.bakery.dto.CustomerDto;
import com.sweetcrumbs.bakery.entity.Customer;
import com.sweetcrumbs.bakery.exception.ResourceNotFoundException;
import com.sweetcrumbs.bakery.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
    }

    public Customer getOrCreateCustomer(CustomerDto dto) {
        return customerRepository.findByEmail(dto.getEmail())
                .map(existing -> {
                    existing.setName(dto.getName());
                    existing.setPhone(dto.getPhone());
                    existing.setAddress(dto.getAddress());
                    existing.setCity(dto.getCity());
                    existing.setPincode(dto.getPincode());
                    return customerRepository.save(existing);
                })
                .orElseGet(() -> {
                    Customer newCustomer = new Customer(
                            dto.getName(),
                            dto.getEmail(),
                            dto.getPhone(),
                            dto.getAddress(),
                            dto.getCity(),
                            dto.getPincode()
                    );
                    return customerRepository.save(newCustomer);
                });
    }
}
