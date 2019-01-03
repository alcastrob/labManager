using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class FacturaTemp
    {
        public int IdFactura { get; set; }
        public int IdDentista { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public decimal Descuento { get; set; }
        public bool Banco { get; set; }
        public bool Efectivo { get; set; }
    }
}
