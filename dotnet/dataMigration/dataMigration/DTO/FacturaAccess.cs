using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class FacturaAccess
    {
        public int IdFactura { get; set; }
        public int? Colegiado { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string CP { get; set; }
        public string Poblacion { get; set; }
        public DateTime? Fecha { get; set; }
        public string Concepto0 { get; set; }
        public decimal? Importe0 { get; set; }
        public decimal? Total { get; set; }
        public decimal? Descuento { get; set; }
        public string CIFNIF { get; set; }
        public string Concepto1 { get; set; }
        public decimal? Importe1 { get; set; }
        public string Concepto2 { get; set; }
        public decimal? Importe2 { get; set; }
        public string Concepto3 { get; set; }
        public decimal? Importe3 { get; set; }
        public string Concepto4 { get; set; }
        public decimal? Importe4 { get; set; }
        public string Concepto5 { get; set; }
        public decimal? Importe5 { get; set; }
        public string Concepto6 { get; set; }
        public decimal? Importe6 { get; set; }
        public string Concepto7 { get; set; }
        public decimal? Importe7 { get; set; }
        public string Concepto8 { get; set; }
        public decimal? Importe8 { get; set; }
        public bool Banco { get; set; }
        public bool Efectivo { get; set; }
    }
}
