<template>
  <mainPage></mainPage>
</template>

<script>
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'chart.js/dist/Chart.min.js'
import 'dropzone/dist/min/dropzone.min.js'
import Vue from 'vue'
import VueSwal from 'vue-swal'
import VueToasted from 'vue-toasted'
import mainPage from './components/Pages/MainPage.vue'

Vue.use(VueSwal)
Vue.use(VueToasted, { iconPack: 'fontawesome', singleton: true })

export default {
	name: 'labManager',
	components: {
		mainPage
	}
}
</script>

<style>
/* Bootstrap */
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
/* Custom fonts for this template */
@import url('~@/assets/css/fontawesome-free/css/all.min.css');
/* Page level plugin CSS */
@import url('~@/assets/css/datatables/datatables.bootstrap4.min.css');
/* Custom styles for this template */
@import url('~@/assets/css/sb-admin.css');
@import url('~@/assets/css/nunito/nunito.css');
@import url('~@/assets/css/animate/animate.min.css');
@import url('~@/assets/css/bootstrap-vue.min.css');
@import url('~@/assets/css/dropzone.min.css');

body {
	background-color: #e4dfda;
	color: #150626;
	font-family: 'Nunito', sans-serif;
}
.btn-warning {
	background-color: #d4b483;
	border-color: #d4b483;
}
.bg-dark {
	background-color: #4a4d4f !important;
}
table.table-bordered tr th {
	background-color: #afa8a1;
}
table.table-bordered tr th:hover {
	background-color: #afa8a1;
	color: #fff !important;
}
table.table-bordered tfoot tr td {
	background-color: #afa8a1;
}
table.table-bordered tr:nth-child(odd) {
	background-color: #f2ece6;
}
table.table-bordered tr:nth-child(even) {
	background-color: #fff6ed;
}

.deaggregated {
	background-color: #fbc2b5 !important;
}
table.table-bordered tr.deaggregated:hover {
	background-color: #ddab9f !important;
}

table.table-bordered tr:not(.deaggregated):hover td {
	background-color: #ddd8d2;
}
table.table-bordered th,
table.table-bordered td {
	border: 1px solid #454849;
}
table.table-bordered i {
	display: none;
}
table.table-bordered tr:hover > td > i {
	display: block;
}
.pagination > li > a,
.pagination > li > span .pagination > li.disabled > a {
	border: 1px solid #afa8a1 !important;
	color: #150626;
}
.pagination > li.active > a {
	background: #afa8a1 !important;
	color: #fff;
}

.swal-button {
	display: inline-block;
	font-weight: 400;
	text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	border: 1px solid transparent;
	box-shadow: none;
	border-radius: 0.25rem;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	line-height: 1.5;
	transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	cursor: pointer;
}
.swal-button--ok {
	background-color: #6c757d;
	border-color: #6c757d;
}
.swal-button:focus {
	outline: none;
	box-shadow: none;
}

.noOverflow {
	overflow-x: hidden;
}
.visuallyhidden:not(:focus):not(:active) {
	position: absolute;

	width: 1px;
	height: 1px;
	margin: -1px;
	border: 0;
	padding: 0;

	white-space: nowrap;

	clip-path: inset(100%);
	clip: rect(0 0 0 0);
	overflow: hidden;
}
.displayNone {
	display: none;
}

.separated-column {
	border-left: 1px solid #cdc8ca;
}
</style>
