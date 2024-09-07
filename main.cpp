#include <string.h>
#include <iostream>
#include "names.h"

int main() {
    initNames();

    std::cerr << "Pipe in name attempts one per line." << std::endl;

    for (std::string line; std::getline(std::cin, line);) {
        const char* output = findCloseFirstName((char*)line.c_str());
        std::cout << output << std::endl;
    }
    return 0;
}
