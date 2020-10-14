# Exámen 1 Sistemas Distribuidos Icesi

### Integrantes
- **Marcela Hormaza** -->  A00310504

- **Bryan Medina** --> A00328416

- **Jessica Sánchez** --> A00030124


### Condiciones del exámen 
- Backend con NodeJS


## Aprovisionamiento del balanceador
Se presentaron tres opciones para la gestión de la configuración, las cuales eran SaltStack, Puppet, Chef.
Tras un concenso grupal se determinó usar SaltStack, aprovechando un demo bastante entendible encontrado en : 

Referencía: https://docs.saltstack.com/en/getstarted/fundamentals/

Este implicaba modificar el Vagrant file y añadir unos archivos para indicar los minion y master correspondientes.

Información que necesitabamos

**¿Qué es un minion en SaltStack?**

Referencía: https://docs.saltstack.com/en/latest/ref/cli/salt-minion.html

**¿Qué es un master en SaltStack?**

Referencía: https://docs.saltstack.com/en/latest/ref/cli/salt-master.html

**Instalación SaltStack**

Referencía: https://docs.saltstack.com/en/latest/topics/tutorials/walkthrough.html

**Configuración Vagrant-SaltStack**

Referencía: https://www.vagrantup.com/docs/provisioning/sa

Referencía: https://medium.com/@Joachim8675309/vagrant-provisioning-with-saltstack-50dab12ce6c7

Referencía: https://docs.saltstack.com/en/latest/topics/cloud/vagrant.html

Referencía: https://hittaruki.info/post/vagrant-saltstack-tutorial/

Referencía: https://www.imagescape.com/blog/2015/08/24/testing-saltstack-vagrant/

Referencía: https://subscription.packtpub.com/book/virtualization_and_cloud/9781789138054/14/ch14lvl1sec68/provisioning-vagrant-with-salt

En nuestro caso, el **Salt master** fue considerado el Load balancer para poder tener como **Salt minion** a los web server 1  y 2.

En la rama Vagrant_salt, se considera el primer intento no funcional que se realizó. Este intento consistía en comprender y aplicar los términos y conceptos consultados. Además de aprovechar el ejemplo brindado por el demo. Sin embargo surgieron varias incognitas.

- ¿Debia algún archivo autogenerarse? 
- ¿Las direcciones IP debian ser cambiadas manualmente?
- ¿Cómo determinar que función cumplía el db? ¿Era un minion o un master?
- Entre otros
