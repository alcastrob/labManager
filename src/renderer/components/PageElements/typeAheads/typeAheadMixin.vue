<style lang="scss">
.myTypeahead {
	z-index: 100;
	box-shadow: 5px 5px 1px #cccccc;
}

/* Boostrap Typeahead CSS */
$input-border-radius: 6px;

@mixin show-dropdown {
	z-index: 1000;
	display: block;
	box-shadow: 10px 10px 5px grey;
	background-color: grey;
}

a {
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
}

.input-inline-button {
	display: inline-block;
	position: absolute;
	z-index: 104;
	right: 0;
	top: 0;
	text-decoration: none;
	padding: 0.5em;
	color: #999;
}

.list-group-item {
	&.active {
		background: #eee;
		border-color: #eee;
		color: #333;
	}
}

.typeahead {
	position: relative;

	.input-group-addon {
		&:after {
			content: ':';
			display: inline;
		}
	}

	&-dropdown {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		margin-top: -2px;
		transition-delay: 0.75s;
		transition: display 1s;

		&:hover {
			display: block;
		}

		> .list-group-item {
			&:first-child {
				border-top-left-radius: 0;
				border-top-right-radius: 0;

				&:not(:last-child) {
					border-radius: 0;
				}
			}
		}

		&:focus {
			@include show-dropdown;
		}
	}

	&-input {
		z-index: 100;
		position: relative;

		&.form-control {
			border-top-right-radius: $input-border-radius !important;
			border-bottom-right-radius: $input-border-radius !important;
		}

		&:focus {
			z-index: 103;
			// padding-bottom: 8px;
			// height: 36px;
			// border-bottom-left-radius: 0;
			// border-bottom-right-radius: 0 !important;

			+ .typeahead-dropdown {
				@include show-dropdown;
			}
		}
	}
}

.hover-reveal-group {
	.hover-reveal {
		visibility: hidden;
	}

	&:hover {
		.hover-reveal {
			visibility: visible;
		}
	}
}

.clickable {
	cursor: pointer;
}
.popup {
	position: absolute;
	top: 50px;
}
.selected {
	background-color: #f4ecd6;
}
</style>
