<template>
    <div class="container ">
        <form id="contactForm">

            <!-- Name input -->
            <div class="mb-3">
       
                <input class="form-control" id="name" type="text" placeholder="Nome" data-sb-validations="required" />
                <div class="invalid-feedback" data-sb-feedback="name:required">Nome obrigatório.</div>
            </div>

            <!-- Email address input -->
            <div class="mb-3">
       
                <input class="form-control" id="emailAddress" type="email" placeholder="Email"
                    data-sb-validations="required, email" />
                <div class="invalid-feedback" data-sb-feedback="emailAddress:required">Email Address is required.</div>
                <div class="invalid-feedback" data-sb-feedback="emailAddress:email">Email Address Email is not valid.</div>
            </div>

            <!-- Message input -->
            <div class="mb-3">
            
                <textarea class="form-control" id="message" type="text" placeholder="Messagem" style="height: 10rem;"
                    data-sb-validations="required"></textarea>
                <div class="invalid-feedback" data-sb-feedback="message:required">Message is required.</div>
            </div>

            <!-- Form submissions success message -->
            <div class="d-none" id="submitSuccessMessage">
                <div class="text-center mb-3">Form submission successful!</div>
            </div>

            <!-- Form submissions error message -->
            <div class="d-none" id="submitErrorMessage">
                <div class="text-center text-danger mb-3">Error sending message!</div>
            </div>

            <!-- Form submit button -->
            <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="submit">Submit</button>
            </div>

        </form>
    </div>
</template>

<style>
.container {
    width: 65%;
    height:50%;
    margin: 0 auto;
}


</style>