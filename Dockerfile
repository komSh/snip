FROM enigmampc/secret-contract-optimizer:latest

RUN rustup override set 1.56.1
RUN rustup target add wasm32-unknown-unknown 
RUN rustc --version
