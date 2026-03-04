/**
 * ATAFI LUXURY - ADMIN JS
 */

// Mock data for admin panel
const mockAdminData = {
    users: [
        { name: 'John Doe', email: 'john@example.com', joined: '2026-03-01', status: 'active', revenue: 2900 },
        { name: 'Jane Smith', email: 'jane@example.com', joined: '2026-03-02', status: 'active', revenue: 2900 },
        { name: 'Bob Johnson', email: 'bob@example.com', joined: '2026-03-03', status: 'pending', revenue: 0 },
        { name: 'Alice Brown', email: 'alice@example.com', joined: '2026-03-04', status: 'active', revenue: 5800 },
        { name: 'Charlie Wilson', email: 'charlie@example.com', joined: '2026-03-04', status: 'inactive', revenue: 0 }
    ],
    transactions: [
        { id: 'TRX-001', user: 'John Doe', amount: 2900, date: '2026-03-04', status: 'success' },
        { id: 'TRX-002', user: 'Jane Smith', amount: 2900, date: '2026-03-03', status: 'success' },
        { id: 'TRX-003', user: 'Alice Brown', amount: 5800, date: '2026-03-02', status: 'success' },
        { id: 'TRX-004', user: 'Bob Johnson', amount: 2900, date: '2026-03-01', status: 'pending' },
        { id: 'TRX-005', user: 'John Doe', amount: 2900, date: '2026-03-01', status: 'success' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    initializeCharts();
    populateTables();
});

function loadAdminData() {
    // Update stats (in production, fetch from API)
    document.getElementById('totalUsers').textContent = '547';
    document.getElementById('totalRevenue').textContent = '₦1,586,300';
    document.getElementById('activeSubs').textContent = '412';
    document.getElementById('conversionRate').textContent = '68%';
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue (₦)',
                data: [450000, 520000, 680000, 745000, 890000, 1020000],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });

    // User Growth Chart
    const userCtx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(userCtx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Pending', 'Inactive'],
            datasets: [{
                data: [412, 85, 50],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function populateTables() {
    // Users table
    const usersTbody = document.getElementById('usersTableBody');
    usersTbody.innerHTML = mockAdminData.users.map(user => `
        <tr>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.joined}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>₦${user.revenue.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewUser('${user.email}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user.email}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Transactions table
    const transactionsTbody = document.getElementById('transactionsTableBody');
    transactionsTbody.innerHTML = mockAdminData.transactions.map(tx => `
        <tr>
            <td><small>${tx.id}</small></td>
            <td>${tx.user}</td>
            <td>₦${tx.amount.toLocaleString()}</td>
            <td>${tx.date}</td>
            <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
        </tr>
    `).join('');
}

function viewUser(email) {
    alert(`View user: ${email}`);
    // Implement user view modal
}


function editUser(email) {
    alert(`Edit user: ${email}`);
    // Implement user edit modal
}