package cz.muni.fi.pa165.dmbk.machinerental.dao.machine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository declaration for Machine DAO providing JPA
 *
 * @author Márius Molčány
 */


@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByName(String name);

    List<Machine> findByNameLike(String name);

    List<Machine> findByManufacturer(String manufacturer);

    List<Machine> findByManufacturerLike(String manufacturer);
}