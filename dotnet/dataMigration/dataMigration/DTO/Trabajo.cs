using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class Trabajo
    {
        public int IdTrabajo { get; set; }
        public int IdDentista { get; set; }
        public int IdTipoTrabajo { get; set; }
        public string Paciente { get; set; }
        public string Color { get; set; }
        public DateTime? FechaTerminacion { get; set; }
        public DateTime? FechaEntrada { get; set; }
        public DateTime? FechaPrevista { get; set; }
        public decimal? PrecioFinal { get; set; }
        public decimal? PrecioMetal { get; set; }
        public decimal? PrecioTotal { get; set; }
        public decimal? PrecioFija { get; set; }
        public string Nombre { get; set; }
    }
}
