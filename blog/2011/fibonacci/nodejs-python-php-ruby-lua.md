# fibonacci(40) benchmark

[Node.js is Cancer](http://teddziuba.com/2011/10/node-js-is-cancer.html) show a wrong way to use nodejs.
But the test code **[Fibonacci](http://en.wikipedia.org/wiki/Fibonacci)** is so funny.
I implement the **fibonacci function** in other **[Dynamic Languages](http://en.wikipedia.org/wiki/Dynamic_programming_language)** for comparison testing.

## Languages

### Dynamic

* [nodejs](http://nodejs.org)
* [nodejs + cpp module](http://kkaefer.github.com/node-cpp-modules)
* [python](http://python.org)
* [pypy](http://pypy.org/): a fast, compliant alternative implementation of the Python language (2.7.1). 
* [perl](http://perl.org) 
* [php](http://www.php.net/)
* [ruby](http://www.ruby-lang.org/)
* [lua](http://www.lua.org/)
* [luajit](http://luajit.org/): a Just-In-Time Compiler for Lua.

### Static

* [c](http://en.wikipedia.org/wiki/C_\(programming_language\))
* [go](http://golang.org/)

If you want to help add more dynamic languagues, please leave the **implement code** in comments.

## Results

(^_^) c > go > luajit > nodejs > pypy > lua > python > php > perl > ruby1.9.3 > ruby1.8.5 (T_T)

<table>
  <tr><th>Language</th><th>Times</th><th>Position</th></tr>
  <tr><td style="color: green;">c</td><td>0m1.606s</td><td>#0</td></tr>
  <tr><td style="color: green;">go</td><td>0m1.769s</td><td>#1</td></tr>
  <tr><td style="color: green;">node + cpp module</td><td>0m2.216s</td><td>#2</td></tr>
  <tr><td style="color: green;">luajit</td><td>0m2.583s</td><td>#3</td></tr>
  <tr><td style="color: green;">nodejs</td><td>0m5.124s</td><td>#4</td></tr>
  <tr><td style="color: green;">pypy</td><td>0m7.562s</td><td>#5</td></tr>
  <tr><td>lua</td><td>0m34.492s</td><td>#6</td></tr>
  <tr><td>python</td><td>1m11.647s</td><td>#7</td></tr>
  <tr><td>php</td><td>1m28.198s</td><td>#8</td></tr>
  <tr><td>perl</td><td>2m34.658s</td><td>#9</td></tr>
  <tr><td style="color: red;">ruby 1.9.3</td><td>4m40.790s</td><td>#10</td></tr>
  <tr><td style="color: red;">ruby 1.8.5</td><td>4m41.942s</td><td>#11</td></tr>
</table>

**lua** use *local function* will get better performance.

## Test Codes

### nodejs

    function fibonacci(n) {
      if (n < 2) {
        return 1;
      }
      return fibonacci(n - 2) + fibonacci(n - 1);
    }

    console.log(fibonacci(40));

run

    $ time node fibonacci.js
    165580141

    real  0m5.153s
    user  0m5.124s
    sys 0m0.012s

### nodejs + cpp module
    
cppfibonacci.cpp

    #include <node/v8.h>
    #include <node/node.h>

    using namespace v8;

    int fibonacci(int n) {
      if (n < 2) {
        return 1;
      }
      return fibonacci(n - 1) + fibonacci(n - 2);
    }

    Handle<Value> Fibonacci(const Arguments& args) {
        HandleScope scope;

        if (args.Length() < 1) {
            return ThrowException(Exception::TypeError(
                String::New("First argument must be a number")));
        }
        Local<Integer> integer = args[0]->ToInteger();
        int r = fibonacci(integer->Value());

        return scope.Close(Integer::New(r));
    }

    void RegisterModule(v8::Handle<v8::Object> target) {
        // Add properties to target
        NODE_SET_METHOD(target, "fibonacci", Fibonacci);
    }

    // Register the module with node.
    NODE_MODULE(cppfibonacci, RegisterModule);

wscript

    #!/usr/bin/env python

    def set_options(ctx):
      ctx.tool_options('compiler_cxx')

    def configure(ctx):
      ctx.check_tool('compiler_cxx')
      ctx.check_tool('node_addon')

    def build(ctx):
      t = ctx.new_task_gen('cxx', 'shlib', 'node_addon')

      t.source = ['cppfibonacci.cpp']

      # Must be same as first parameter in NODE_MODULE.
      t.target = 'cppfibonacci'

cppfibonacci.js

    var fibonacci = require('./build/default/cppfibonacci').fibonacci;
    console.log(fibonacci(40));

run

    $ node-waf configure
    $ node-waf build
    $ time node cppfibonacci.js
    165580141

    real  0m2.224s
    user  0m2.216s
    sys 0m0.008s

### python2.4.3 && python2.6.7 && pypy1.7

    def fibonacci(n):
        if n < 2:
            return 1
        return fibonacci(n - 2) + fibonacci(n - 1)
        
    print fibonacci(40)

run

    $ time python2.4.3 fibonacci.py
    165580141

    real  1m11.667s
    user  1m11.647s
    sys 0m0.002s

    $ time python2.6.7 fibonacci.py
    165580141

    real  1m9.837s
    user  1m9.792s
    sys 0m0.006s

    $ time ./pypy-1.7/bin/pypy fibonacci.py
    165580141

    real  0m7.608s
    user  0m7.562s
    sys 0m0.031s


### perl

    sub fibonacci {
        my $n = shift;
        if ($n < 2) {
          return 1;
        }
        return fibonacci($n - 2) + fibonacci($n - 1);
    }

    print fibonacci(40), "\n";

run

    $ time perl fibonacci.pl
    165580141

    real  2m34.777s
    user  2m34.658s
    sys 0m0.004s

### php

    <?php

    function fibonacci($n) {
      if ($n < 2) {
        return 1;
      }
      return fibonacci($n - 2) + fibonacci($n - 1);
    }

    echo fibonacci(40)."\n";

    ?>

run

    $ time php fibonacci.php
    
    165580141
    real  1m28.364s
    user  1m28.198s
    sys 0m0.039s

### ruby1.8.5 && ruby1.9.3

    def fibonacci(n)
      if n < 2
        return 1
      end
      return fibonacci(n - 2) + fibonacci(n - 1)
    end

    puts fibonacci(40)

run

    $ time ruby1.8.5 fibonacci.rb
    165580141

    real  5m43.132s
    user  4m41.942s
    sys 1m0.653s

    $ time ruby1.9.3 fibonacci.rb
    165580141

    real  5m41.714s
    user  4m40.790s
    sys 1m0.661s
    

### lua && luajit

    function fibonacci(n)
      if n < 2 then
        return 1
      end
      return fibonacci(n - 2) + fibonacci(n - 1)
    end

    io.write(fibonacci(40), "\n")

run

    $ time ./lua-5.1.4/src/lua fibonacci.lua 
    165580141

    real  0m34.514s
    user  0m34.492s
    sys 0m0.004s

    $ time ./LuaJIT-2.0.0-beta9/src/luajit fibonacci.lua 
    165580141

    real  0m2.598s
    user  0m2.583s
    sys 0m0.001s

local function should be faster:

    local function fibonacci(n)
      if n < 2 then
        return 1
      end
      return fibonacci(n - 2) + fibonacci(n - 1)
    end

    io.write(fibonacci(40), "\n")

    $ time ./lua-5.1.4/src/lua fibonacci.lua.local
    165580141

    real  0m31.737s
    user  0m31.549s
    sys 0m0.001s

    $ time ./LuaJIT-2.0.0-beta9/src/luajit fibonacci.lua.local
    165580141

    real  0m2.227s
    user  0m2.225s
    sys 0m0.001s

### c

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

run

    $ gcc fibonacci.c
    $ time ./a.out 
    165580141

    real  0m3.434s
    user  0m3.427s
    sys 0m0.000s

Compilation with optimization:

    $ gcc -O2 fibonacci.c
    $ time ./a.out 
    165580141

    real  0m1.607s
    user  0m1.606s
    sys 0m0.001s

[@fool](http://cnodejs.org/blog/?p=4982#comment-1875): How about C++ meta programming, it’s a bit of cheating

    #include <stdio.h>
     
    template<int n>
    struct fibonacci {
        enum { Result = fibonacci<n-2>::Result + fibonacci<n-1>::Result };
    };
     
    template<>
    struct fibonacci<1> {
        enum { Result = 1 };
    };
     
    template<>
    struct fibonacci<0> {
        enum { Result = 1 };
    };
     
    int main(int argc, char *argv[])
    {
        printf("%d\n", fibonacci<40>::Result);
        return 0;
    }

run

    $ g++ fibonacci.template.cpp 
    $ time ./a.out
    165580141

    real  0m0.002s
    user  0m0.001s
    sys 0m0.001s

### go

    package main

    import "fmt"

    func fibonacci(n int) int{
      if (n < 2) {
        return 1
      }
      return fibonacci(n - 2) + fibonacci(n - 1)
    }

    func main() {
      fmt.Println(fibonacci(10))
    }

run

    $ 6g fibonacci.go
    $ 6l fibonacci.6
    $ time ./6.out
    165580141

    real  0m1.770s
    user  0m1.769s
    sys 0m0.001s

## Conclusion

**nodejs** is very **FAST**. 
**luajit** 2X faster than nodejs, **Shocking**.
