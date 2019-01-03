using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class DeclaracionConformidadAccess
    {
        public int NumeroDeclaracion { get; set; }
        public string Prescriptor { get; set; }
        public string Paciente { get; set; }
        public int Albaran { get; set; }
        public DateTime? Fecha{ get; set; }
        public int? Meses { get; set; }
        public string ProductoLote { get; set; }
        public string ProductoLote2 { get; set; }
        public string ProductoLote3 { get; set; }
        public string ProductoLote4 { get; set; }
    }
}
