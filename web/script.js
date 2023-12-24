let currentPage = 1;
const processesPerPage = 50;
let paginatedProcesses = [];

document.addEventListener('DOMContentLoaded', function () {
  fetchSystemInfo();
});

function fetchSystemInfo() {
  fetch('/system')
    .then((response) => response.json())
    .then((data) => {
      updateSystemInfo(data);
      updateProcessesTable(data.processes);
    })
    .catch((error) => console.error('Error:', error));
}

function updateSystemInfo(data) {
  const systemInfoDiv = document.getElementById('system-info');
  systemInfoDiv.innerHTML = '';

  const infoItems = [
    { title: 'Host Name', value: data.host_name },
    { title: 'OS Name', value: data.os_name },
    { title: 'OS Version', value: data.os_version },
    { title: 'Total Memory', value: formatBytes(data.total_memory) },
    { title: 'Used Memory', value: formatBytes(data.used_memory) },
    { title: 'Total Swap', value: formatBytes(data.total_swap) },
    { title: 'Used Swap', value: formatBytes(data.used_swap) },
    { title: 'CPU Count', value: data.cpu_count.toString() },
  ];

  infoItems.forEach((item) => {
    const card = createInfoCard(item.title, item.value);
    systemInfoDiv.appendChild(card);
  });
}

function createInfoCard(title, value) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'bg-white pt-4 p-8 px-6 rounded-lg shadow-md';
  cardDiv.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-700">${title}</h3>
      <p class="text-gray-600">${value}</p>
  `;
  return cardDiv;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function updateProcessesTable(processes) {
  const tableBody = document.getElementById('processes-table-body');
  tableBody.innerHTML = '';

  processes.forEach((process) => {
    const row = createProcessRow(process);
    tableBody.appendChild(row);
  });

  paginateProcesses([...processes]);
  showPage(1);
}

function createProcessRow(process) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${
        process.pid
      }</td>
      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${
        process.name
      }</td>
      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${formatBytes(
        process.disk_usage.read_bytes,
      )}</td>
      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${formatBytes(
        process.disk_usage.written_bytes,
      )}</td>
      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <button class="text-red-500 hover:text-red-700" onclick="killProcess(${
            process.pid
          })">Kill</button>
      </td>
  `;
  return tr;
}

function paginateProcesses(processes) {
  paginatedProcesses = [];
  while (processes.length) {
    paginatedProcesses.push(processes.splice(0, processesPerPage));
  }
}

function showPage(pageNumber) {
  currentPage = pageNumber;
  const processesTableBody = document.getElementById('processes-table-body');
  processesTableBody.innerHTML = '';

  paginatedProcesses[pageNumber - 1].forEach((process) => {
    const row = createProcessRow(process);
    processesTableBody.appendChild(row);
  });

  updatePaginationControls();
}

function updatePaginationControls() {
  const paginationControls = document.getElementById('pagination-controls');
  paginationControls.innerHTML = '';

  for (let i = 1; i <= paginatedProcesses.length; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.className = `mx-1 px-4 py-2 rounded ${
      i === currentPage ? 'bg-blue-500 text-white' : 'bg-white border'
    }`;
    button.addEventListener('click', () => showPage(i));
    paginationControls.appendChild(button);
  }
}

function killProcess(pid) {
  fetch('/kill_process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pid: pid }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to kill process');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Process killed:', data);
      fetchSystemInfo();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
