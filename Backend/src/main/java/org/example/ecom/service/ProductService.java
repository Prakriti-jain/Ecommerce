package org.example.ecom.service;

import org.example.ecom.model.Product;
import org.example.ecom.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    //add product
    public Product addProduct(Product product){
        return repo.save(product);
    }

    //get all products
    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Optional<Product> getProductById(Long productId) {
        return repo.findById(productId);
    }

    //delete product
    public void deleteProduct(Long id){
        repo.deleteById(id);
    }

    //update product
    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setAvailable(updatedProduct.isAvailable());

        return repo.save(product);
    }

}
