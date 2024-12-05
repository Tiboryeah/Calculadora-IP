function calcular() {
    const ip = document.getElementById("ip").value;
    const netmask = document.getElementById("netmask").value;
    const netmask2 = document.getElementById("netmask2").value;

    // Convertir IP y máscara a formato binario
    const ipBinary = ipToBinary(ip);
    const maskBinary = cidrToBinary(netmask);

    const wildcardBinary = getWildcardBinary(maskBinary);
    const networkBinary = getNetworkBinary(ipBinary, maskBinary);
    const broadcastBinary = getBroadcastBinary(networkBinary, maskBinary);

    const network = binaryToIp(networkBinary);
    const broadcast = binaryToIp(broadcastBinary);
    const hostMin = binaryToIp(networkBinary.slice(0, 31) + '1'); // Primer host
    const hostMax = binaryToIp(broadcastBinary.slice(0, 31) + '0'); // Último host
    const wildcard = binaryToIp(wildcardBinary);
    const hostsNet = Math.pow(2, 32 - parseInt(netmask)) - 2; // Total de hosts en la red
    const networkClass = getNetworkClass(ip); // Corregido para usar la dirección IP

    // Mostrar los resultados originales
    document.getElementById("address").innerHTML = `${ip}`;
    document.getElementById("addressBinary").innerHTML = `${formatBinary(ipBinary)}`; // Formateamos con puntos
    document.getElementById("netmaskResult").innerHTML = `${decimalToNetmask(netmask)} = ${netmask}`;
    document.getElementById("netmaskBinary").innerHTML = `${formatBinary(maskBinary)}`; // Formateamos con puntos
    document.getElementById("wildcard").innerHTML = `${wildcard}`;
    document.getElementById("wildcardBinary").innerHTML = `${formatBinary(wildcardBinary)}`; // Formateamos con puntos
    document.getElementById("network").innerHTML = `${network}/${netmask}`;
    document.getElementById("networkBinary").innerHTML = `${formatBinary(networkBinary)}`; // Formateamos con puntos
    document.getElementById("hostMin").innerHTML = `${hostMin}`;
    document.getElementById("hostMinBinary").innerHTML = `${formatBinary(networkBinary.slice(0, 31) + '1')}`; // Formateamos con puntos
    document.getElementById("hostMax").innerHTML = `${hostMax}`;
    document.getElementById("hostMaxBinary").innerHTML = `${formatBinary(broadcastBinary.slice(0, 31) + '0')}`; // Formateamos con puntos
    document.getElementById("broadcast").innerHTML = `${broadcast}`;
    document.getElementById("broadcastBinary").innerHTML = `${formatBinary(broadcastBinary)}`; // Formateamos con puntos
    document.getElementById("hostsNet").innerHTML = `${hostsNet}`;
    document.getElementById("class").innerHTML = `${networkClass}`;

    // Si se ha introducido una máscara de sub/super red
    if (netmask2) {
        const maskBinary2 = cidrToBinary(netmask2);
        const wildcardBinary2 = getWildcardBinary(maskBinary2);
        const networkBinary2 = getNetworkBinary(ipBinary, maskBinary2);
        const broadcastBinary2 = getBroadcastBinary(networkBinary2, maskBinary2);

        const network2 = binaryToIp(networkBinary2);
        const broadcast2 = binaryToIp(broadcastBinary2);
        const hostMin2 = binaryToIp(networkBinary2.slice(0, 31) + '1');
        const hostMax2 = binaryToIp(broadcastBinary2.slice(0, 31) + '0');
        const wildcard2 = binaryToIp(wildcardBinary2);

        // Mostrar los resultados de subred/superred
        document.getElementById("resultadosSubredes").classList.remove("hidden");

        document.getElementById("addressSubred").innerHTML = `${ip}`;
        document.getElementById("addressBinarySubred").innerHTML = `${formatBinary(ipBinary)}`;
        document.getElementById("netmaskResultSubred").innerHTML = `${decimalToNetmask(netmask2)} = ${netmask2}`;
        document.getElementById("netmaskBinarySubred").innerHTML = `${formatBinary(maskBinary2)}`;
        document.getElementById("wildcardSubred").innerHTML = `${wildcard2}`;
        document.getElementById("wildcardBinarySubred").innerHTML = `${formatBinary(wildcardBinary2)}`;
        document.getElementById("networkSubred").innerHTML = `${network2}/${netmask2}`;
        document.getElementById("networkBinarySubred").innerHTML = `${formatBinary(networkBinary2)}`;
        document.getElementById("hostMinSubred").innerHTML = `${hostMin2}`;
        document.getElementById("hostMinBinarySubred").innerHTML = `${formatBinary(networkBinary2.slice(0, 31) + '1')}`;
        document.getElementById("hostMaxSubred").innerHTML = `${hostMax2}`;
        document.getElementById("hostMaxBinarySubred").innerHTML = `${formatBinary(broadcastBinary2.slice(0, 31) + '0')}`;
        document.getElementById("broadcastSubred").innerHTML = `${broadcast2}`;
        document.getElementById("broadcastBinarySubred").innerHTML = `${formatBinary(broadcastBinary2)}`;
        document.getElementById("hostsNetSubred").innerHTML = `${Math.pow(2, 32 - parseInt(netmask2)) - 2}`;
        document.getElementById("classSubred").innerHTML = `${getNetworkClass(ip)}`;
    }
}

// Funciones auxiliares

// Convertir la IP en formato binario
function ipToBinary(ip) {
    return ip.split('.').map(octet => ("00000000" + (parseInt(octet)).toString(2)).slice(-8)).join('');
}

// Convertir la máscara CIDR a binario
function cidrToBinary(cidr) {
    const bits = parseInt(cidr);
    return "1".repeat(bits) + "0".repeat(32 - bits);
}

// Obtener la máscara comodín en binario (corregida)
function getWildcardBinary(maskBinary) {
    let wildcardBinary = '';
    for (let i = 0; i < maskBinary.length; i++) {
        wildcardBinary += maskBinary[i] === '1' ? '0' : '1';
    }
    return wildcardBinary;
}


// Calcular la red (network) en binario
function getNetworkBinary(ipBinary, maskBinary) {
    let networkBinary = '';
    for (let i = 0; i < 32; i++) {
        networkBinary += ipBinary[i] === maskBinary[i] ? ipBinary[i] : '0';
    }
    return networkBinary;
}

// Calcular el broadcast en binario
function getBroadcastBinary(networkBinary, maskBinary) {
    let broadcastBinary = '';
    for (let i = 0; i < 32; i++) {
        broadcastBinary += maskBinary[i] === '1' ? networkBinary[i] : '1';
    }
    return broadcastBinary;
}

// Convertir de binario a IP
function binaryToIp(binary) {
    return binary.match(/.{8}/g).map(bin => parseInt(bin, 2)).join('.');
}

// Convertir el valor CIDR a la máscara decimal
function decimalToNetmask(cidr) {
    const maskBinary = "1".repeat(cidr) + "0".repeat(32 - cidr);
    return maskBinary.match(/.{8}/g).map(bin => parseInt(bin, 2)).join('.');
}

// Determinar la clase de red de la IP
function getNetworkClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 127) {
        return "Clase A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        return "Clase B";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        return "Clase C";
    } else {
        return "Clase no asignada (Clase D o E)";
    }
}

// Formatear binario con puntos en octetos
function formatBinary(binary) {
    return binary.match(/.{8}/g).join('.');
}
