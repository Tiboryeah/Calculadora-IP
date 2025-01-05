function calcular() {
    const ip = document.getElementById("ip").value.trim();
    const netmask = parseInt(document.getElementById("netmask").value.trim());
    const netmask2 = document.getElementById("netmask2").value.trim();

    if (!validarIP(ip)) {
        alert("Dirección IP no válida.");
        return;
    }
    if (!validarCIDR(netmask)) {
        alert("Máscara de subred no válida.");
        return;
    }

    const ipBinary = ipToBinary(ip);
    const maskBinary = cidrToBinary(netmask);
    const networkBinary = getNetworkBinary(ipBinary, maskBinary);
    const broadcastBinary = getBroadcastBinary(networkBinary, maskBinary);

    const network = binaryToIp(networkBinary);
    const broadcast = binaryToIp(broadcastBinary);
    const wildcardBinary = getWildcardBinary(maskBinary);
    const wildcard = binaryToIp(wildcardBinary);
    const hostMinBinary = incrementBinary(networkBinary);
    const hostMaxBinary = decrementBinary(broadcastBinary);
    const hostMin = binaryToIp(hostMinBinary);
    const hostMax = binaryToIp(hostMaxBinary);
    const hostsNet = calcularHostsNet(netmask);
    const networkClass = getNetworkClass(network);

    mostrarResultadosOriginales(ip, ipBinary, netmask, maskBinary, wildcard, wildcardBinary, network, networkBinary, broadcast, broadcastBinary, hostMin, hostMinBinary, hostMax, hostMaxBinary, hostsNet, networkClass);

    if (netmask2) {
        if (!validarCIDR(netmask2)) {
            alert("Máscara secundaria no válida.");
            return;
        }
        generarTransicionesSubredes(ipBinary, netmask, parseInt(netmask2));
    }
}

function mostrarResultadosOriginales(ip, ipBinary, netmask, maskBinary, wildcard, wildcardBinary, network, networkBinary, broadcast, broadcastBinary, hostMin, hostMinBinary, hostMax, hostMaxBinary, hostsNet, networkClass) {
    document.getElementById("address").innerHTML = ip;
    document.getElementById("addressBinary").innerHTML = formatBinary(ipBinary);
    document.getElementById("netmaskResult").innerHTML = `${decimalToNetmask(netmask)} = ${netmask}`;
    document.getElementById("netmaskBinary").innerHTML = formatBinary(maskBinary);
    document.getElementById("wildcard").innerHTML = wildcard;
    document.getElementById("wildcardBinary").innerHTML = formatBinary(wildcardBinary);
    document.getElementById("network").innerHTML = `${network}/${netmask}`;
    document.getElementById("networkBinary").innerHTML = formatBinary(networkBinary);
    document.getElementById("broadcast").innerHTML = broadcast;
    document.getElementById("broadcastBinary").innerHTML = formatBinary(broadcastBinary);
    document.getElementById("hostMin").innerHTML = hostMin;
    document.getElementById("hostMinBinary").innerHTML = formatBinary(hostMinBinary);
    document.getElementById("hostMax").innerHTML = hostMax;
    document.getElementById("hostMaxBinary").innerHTML = formatBinary(hostMaxBinary);
    document.getElementById("hostsNet").innerHTML = hostsNet;
    document.getElementById("class").innerHTML = networkClass;
}

function generarTransicionesSubredes(ipBinary, netmask1, netmask2) {
    const contenedor = document.getElementById("transicionesSubredes");
    contenedor.innerHTML = "";

    const saltoSubred = Math.pow(2, 32 - netmask2);
    const totalSubredes = Math.pow(2, netmask2 - netmask1);
    let direccionActual = parseInt(ipBinary, 2);

    let contenidoHTML = "";
    for (let i = 0; i < totalSubredes; i++) {
        const networkBinary = direccionActual.toString(2).padStart(32, '0');
        const maskBinary = cidrToBinary(netmask2);
        const broadcastBinary = getBroadcastBinary(networkBinary, maskBinary);

        const network = binaryToIp(networkBinary);
        const broadcast = binaryToIp(broadcastBinary);
        const wildcardBinary = getWildcardBinary(maskBinary);
        const hostMinBinary = incrementBinary(networkBinary);
        const hostMaxBinary = decrementBinary(broadcastBinary);
        const hostMin = binaryToIp(hostMinBinary);
        const hostMax = binaryToIp(hostMaxBinary);
        const hostsNet = calcularHostsNet(netmask2);
        const networkClass = getNetworkClass(network);

        contenidoHTML += `
            <h3>Subred ${i + 1}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Campo</th>
                        <th>Valor</th>
                        <th>Binario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Network</td><td>${network}/${netmask2}</td><td>${formatBinary(networkBinary)}</td></tr>
                    <tr><td>Netmask</td><td>${decimalToNetmask(netmask2)}</td><td>${formatBinary(maskBinary)}</td></tr>
                    <tr><td>Wildcard</td><td>${binaryToIp(wildcardBinary)}</td><td>${formatBinary(wildcardBinary)}</td></tr>
                    <tr><td>HostMin</td><td>${hostMin}</td><td>${formatBinary(hostMinBinary)}</td></tr>
                    <tr><td>HostMax</td><td>${hostMax}</td><td>${formatBinary(hostMaxBinary)}</td></tr>
                    <tr><td>Broadcast</td><td>${broadcast}</td><td>${formatBinary(broadcastBinary)}</td></tr>
                    <tr><td>Hosts/Net</td><td>${hostsNet}</td><td>-</td></tr>
                    <tr><td>Clase</td><td>${networkClass}</td><td>-</td></tr>
                </tbody>
            </table>
        `;
        direccionActual += saltoSubred;
    }

    contenedor.innerHTML = contenidoHTML;
}

// Funciones auxiliares
function validarIP(ip) {
    return /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/.test(ip);
}

function validarCIDR(cidr) {
    return cidr >= 0 && cidr <= 32;
}

function ipToBinary(ip) {
    return ip.split(".").map(octet => parseInt(octet).toString(2).padStart(8, "0")).join("");
}

function cidrToBinary(cidr) {
    return '1'.repeat(cidr) + '0'.repeat(32 - cidr);
}

function getNetworkBinary(ipBinary, maskBinary) {
    return ipBinary.split("").map((bit, i) => bit & maskBinary[i]).join("");
}

function getBroadcastBinary(networkBinary, maskBinary) {
    const invertedMask = getWildcardBinary(maskBinary);
    return (BigInt("0b" + networkBinary) | BigInt("0b" + invertedMask)).toString(2).padStart(32, "0");
}

function getWildcardBinary(maskBinary) {
    return maskBinary.replace(/1/g, "0").replace(/0/g, "1");
}

function incrementBinary(binary) {
    return (BigInt("0b" + binary) + 1n).toString(2).padStart(32, "0");
}

function decrementBinary(binary) {
    return (BigInt("0b" + binary) - 1n).toString(2).padStart(32, "0");
}

function binaryToIp(binary) {
    return binary.match(/.{8}/g).map(octet => parseInt(octet, 2)).join(".");
}

function formatBinary(binary) {
    return binary.match(/.{8}/g).join(".");
}

function decimalToNetmask(cidr) {
    return binaryToIp(cidrToBinary(cidr));
}

function calcularHostsNet(cidr) {
    if (cidr === 31) return 2;
    if (cidr === 32) return 1;
    return Math.pow(2, 32 - cidr) - 2;
}

function getNetworkClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet <= 127) return "Clase A";
    if (firstOctet <= 191) return "Clase B";
    if (firstOctet <= 223) return "Clase C";
    if (firstOctet <= 239) return "Clase D";
    return "Clase E";
}
