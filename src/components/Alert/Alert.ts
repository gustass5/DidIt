import Swal from 'sweetalert2';

export const Alert = Swal.mixin({
	toast: true,
	position: 'bottom-right',
	customClass: {
		popup: 'colored-toast'
	},
	showConfirmButton: false,
	timer: 2500,
	timerProgressBar: true
});
