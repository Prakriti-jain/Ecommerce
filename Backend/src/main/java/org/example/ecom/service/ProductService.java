package org.example.ecom.service;

import org.example.ecom.exceptions.ResourceNotFoundException;
import org.example.ecom.model.Product;
import org.example.ecom.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * This includes:
 * - Adding products
 * - Fetching products
 * - Updating product details
 * - Deleting products
 */
@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    /**
     * Adds a new product to the system.
     *
     * @param product product entity to be saved
     * @return saved Product object
     */
    public Product addProduct(Product product){
        return repo.save(product);
    }

    /**
     * Retrieves all products from the database.
     *
     * @return list of all available products
     */
    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    /**
     * Fetches a product using its unique ID.
     *
     * @param productId ID of the product
     * @return Optional containing product if found
     */
    public Optional<Product> getProductById(Long productId) {
        return repo.findById(productId);
    }

    /**
     * Deletes a product from the system.
     *
     * @param id ID of the product to be deleted
     */
    public void deleteProduct(Long id){
        repo.deleteById(id);
    }

    /**
     * Updates the details of an existing product.
     *
     * @param id ID of the product to update
     * @param updatedProduct product object containing updated fields
     * @return updated Product object
     * @throws ResourceNotFoundException if the product does not exist
     */
    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setAvailable(updatedProduct.isAvailable());
        product.setImageUrl(updatedProduct.getImageUrl());

        return repo.save(product);
    }

}
