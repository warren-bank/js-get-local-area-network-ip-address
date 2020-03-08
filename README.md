### [Local Area Network IP Address](https://github.com/warren-bank/js-get-local-area-network-ip-address)

Client-side javascript function that uses WebRTC to obtain an IP address on the LAN

#### Credits:

* [net.ipcalf.com](http://net.ipcalf.com/) did all the heavy lifting

#### Summary:

* the purpose of this repo is to:
  - refactor their code into a reusable library function
  - rewrite their SPA to demonstrate usage
  - host on _Github Pages_:
    * [library](https://warren-bank.github.io/js-get-local-area-network-ip-address/get-local-area-network-ip-address.js)
    * [demo](https://warren-bank.github.io/js-get-local-area-network-ip-address/)

#### Usage:

`let promise = window.getLocalAreaNetworkIpAddress(timeoutMs)`

* `timeoutMs`
  - defaults to `1000` milliseconds
* `promise`
  - resolves to a string that holds an IP address on the LAN
  - rejects if an error or timeout occurs

#### Legal:

* copyright: [net.ipcalf.com](http://net.ipcalf.com/)
