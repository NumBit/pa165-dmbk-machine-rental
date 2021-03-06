package cz.muni.fi.pa165.dmbk.machinerental.controller;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import cz.muni.fi.pa165.dmbk.machinerental.dao.user.LegalForm;
import cz.muni.fi.pa165.dmbk.machinerental.facadeapi.user.UserFacade;
import cz.muni.fi.pa165.dmbk.machinerental.facadeapi.user.model.AdminDto;
import cz.muni.fi.pa165.dmbk.machinerental.facadeapi.user.model.CustomerDto;
import cz.muni.fi.pa165.dmbk.machinerental.facadeapi.user.model.UserDto;
import cz.muni.fi.pa165.dmbk.machinerental.security.SecurityService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * Rest controller representing REST API endpoint
 * for user (customer | admin) operations using
 * mainly JSON data format. See facade layer
 * functionalities to check validation's.
 *
 * @author Norbert Dopjera 456355@mail.muni.cz
 */
@Slf4j
@RestController
@PropertySource(value = "classpath:application.properties")
@RequestMapping(value = "${spring.custom.rest-api.contextPath}")
public class UserRestController {

    @Autowired private UserFacade userFacade;
    @Autowired private SecurityService securityService;

    @Getter
    @ToString
    @EqualsAndHashCode
    @JsonDeserialize(builder = Credentials.Builder.class)
    @Builder(builderClassName = "Builder", toBuilder = true, setterPrefix = "with")
    static class Credentials {
        private final String username;
        private final String password;
    }

    @GetMapping("${spring.rest-api.userPath}/authenticated")
    public ResponseEntity<UserDto> getAuthenticatedUser() {
        return ResponseEntity.of(securityService.findLoggedInUser());
    }

    @PostMapping("${spring.rest-api.userPath}/login")
    public ResponseEntity<UserDto> login(@RequestBody Credentials credentials) {
        // no matter what credentials contain, it must be valid authentication data
        // otherwise security service will return false, thus no validations are required
        return securityService.authenticate(credentials.getUsername(), credentials.getPassword())
                ? ResponseEntity.of(securityService.findLoggedInUser())
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("${spring.rest-api.userPath}/customer")
    public ResponseEntity<CustomerDto> findCustomerByEmail(@RequestBody String email) {
        var user = userFacade.findCustomerByEmail(email);
        log.info(user.toString());
        return ResponseEntity.of(userFacade.findCustomerByEmail(email));
    }

    @GetMapping("${spring.rest-api.adminPath}/user/{userLogin}")
    public ResponseEntity<UserDto> findByLogin(@PathVariable String userLogin) {
        return ResponseEntity.of(userFacade.findByLogin(userLogin));
    }

    @GetMapping("${spring.rest-api.adminPath}/sure_name/{sureName}")
    public ResponseEntity<List<AdminDto>> findAdminsBySureName(@PathVariable String sureName) {
        return ResponseEntity.ok(userFacade.findAdminsBySureName(sureName));
    }

    @PostMapping("${spring.rest-api.adminPath}/customer/legal_form")
    public ResponseEntity<List<CustomerDto>> findCustomersByLegalForm(@RequestBody LegalForm legalForm) {
        return ResponseEntity.ok(userFacade.findCustomersByLegalForm(legalForm));
    }

    @DeleteMapping("${spring.rest-api.adminPath}/user")
    public ResponseEntity<?> deleteAllUsers() {
        userFacade.deleteAllUsers();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("${spring.rest-api.adminPath}/user/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long userId) {
        userFacade.deleteUserById(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("${spring.rest-api.adminPath}/is/{login}")
    public ResponseEntity<Boolean> isAdmin(@PathVariable String login) {
        var user = userFacade.findByLogin(login);
        if (user.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        return user.map(userDto -> ResponseEntity.ok(userFacade.isAdmin(userDto).get())) // safe get
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(false));
    }

    @GetMapping("${spring.rest-api.adminPath}/allCustomers")
    public ResponseEntity<List<CustomerDto>> findAllCustomers() {
        var customers = userFacade.findAllCustomers();
        return ResponseEntity.ok(customers);
    }
}
