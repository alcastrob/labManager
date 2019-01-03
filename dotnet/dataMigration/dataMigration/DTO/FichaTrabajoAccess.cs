using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class FichaTrabajoAccess
    {
        public int Id { get; set; }
        public string Dr { get; set; }
        public int? Colegiado { get; set; }
        public string Domicilio { get; set; }
        public string Telefono { get; set; }
        public string Paciente { get; set; }
        public bool Varon { get; set; }
        public bool Hembra { get; set; }
        public int? Edad { get; set; }
        public string Indicaciones1 { get; set; }
        public string Indicaciones2 { get; set; }
        public string Indicaciones3 { get; set; }
        public string Indicaciones4 { get; set; }
        public string Indicaciones5 { get; set; }
        public string Indicaciones6 { get; set; }
        public string Indicaciones7 { get; set; }
        public bool Fija { get; set; }
        public bool Implantes{ get; set; }
        public bool Aditamentos { get; set; }
        public bool Resina { get; set; }
        public bool Esqueletico { get; set; }
        public bool Ortodoncia { get; set; }
        public bool Oclusion { get; set; }
        public bool Metal { get; set; }
        public string Color { get; set; }
        public DateTime? FechaTerminacion { get; set; }
        public string PrecioFinal { get; set; }
        public DateTime? FechaEntrada { get; set; }
        public DateTime? FechaPrevista { get; set; }
        public string Nombre { get; set; }
        public string CP { get; set; }
        public string Ciudad { get; set; }
        public decimal? Precio1 { get; set; }
        public decimal? Precio2 { get; set; }
        public decimal? Precio3 { get; set; }
        public decimal? Precio4 { get; set; }
        public decimal? Precio5 { get; set; }
        public decimal? Precio6 { get; set; }
        public decimal? Precio7 { get; set; }
        public decimal? PrecioMetal { get; set; }
        public string TipoTrabajo { get; set; }
    }
}

