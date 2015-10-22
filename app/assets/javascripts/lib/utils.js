/**
 * CU UTILS MODULE
 *
 *
 * Keep all useful helper utility functions in here.
 *
 *
 *
 */

var utils = {

	/** 
	 * Convert month format from numbers to abbreviation
	 */
	toShortMonthName: function (month) {
		switch (parseInt(month)) {
			case 1:
				return 'JAN';
			case 2:
				return 'FEB';
			case 3:
				return 'MAR';
			case 4:
				return 'APR';
			case 5:
				return 'MAY';
			case 6:
				return 'JUN';
			case 7:
				return 'JULY';
			case 8:
				return 'AUG';
			case 9:
				return 'SEPT';
			case 10:
				return 'OCT';
			case 11:
				return 'NOV';
			case 12:
				return 'DEC';
			default:
				return '';
		}
	},

	/** 
	 * Convert month format from 2-digit (leading zero) string to abbreviation
	 */
	toShortMonthName_fromstring: function(month) {
		switch (month) {
			case '01':
				return 'JAN';
			case '02':
				return 'FEB';
			case '03':
				return 'MAR';
			case '04':
				return 'APR';
			case '05':
				return 'MAY';
			case '06':
				return 'JUN';
			case '07':
				return 'JULY';
			case '08':
				return 'AUG';
			case '09':
				return 'SEPT';
			case '10':
				return 'OCT';
			case '11':
				return 'NOV';
			case '12':
				return 'DEC';
			default:
				return '';
		}
	},

	/** 
	 * Pad day with leading zero
	 */
	pad2: function(number) {
		return (number < 10 ? '0' : '') + number;
	}
};
