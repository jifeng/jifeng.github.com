#include <stdio.h>

int fibonacci(n) {
  if (n < 2) {
    return 1;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
}

int main() {
  printf("%d\n", fibonacci(40));
  return 0;
}