hello: utils.c main.c utils.h
		gcc main.c utils.c -o hello
varexpand_hello: utils.c main.c
		gcc $^ -o $@
clean:
		rm -f hello
cleanvar:
		rm -rf varexpand_hello
