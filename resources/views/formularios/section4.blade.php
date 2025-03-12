<div id="section-4" class="form-section" style="display: none;">
    <h2 class="section-title">
        <i class="fas fa-users"></i>
        Socios o Accionistas (Persona Moral)
    </h2>
    <div class="row">
        <div class="col-md-12">
            <div class="form-group">
                <div class="table-responsive">
                    <table class="table table-bordered" id="tabla-socios">
                        <thead>
                            <tr>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Nombre(s)</th>
                                <th>Porcentaje de Acciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Fila de ejemplo (este es el formato que se replicará) -->
                            <tr>
                                <td>
                                    <input type="text" class="form-control" placeholder="Apellido Paterno">
                                </td>
                                <td>
                                    <input type="text" class="form-control" placeholder="Apellido Materno">
                                </td>
                                <td>
                                    <input type="text" class="form-control" placeholder="Nombre(s)">
                                </td>
                                <td>
                                    <div style="display: flex; align-items: center;">
                                        <input type="text" class="form-control porcentaje-input" placeholder="Ej: 50" style="flex: 1; margin-right: 8px;">
                                        <span class="porcentaje-simbolo">%</span>
                                    </div>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-danger btn-sm eliminar-socio">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" id="agregar-socio" class="btn btn-gris mt-2">
                    <i class="fas fa-plus"></i> Agregar Socio
                </button>
            </div>
        </div>
    </div>
</div>