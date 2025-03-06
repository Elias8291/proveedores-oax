<div id="section-2" class="form-section" style="display: none;">
    <h2 class="section-title">
        <i class="fas fa-map-marker-alt"></i>
        Domicilio
    </h2>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label class="form-label" for="codigo_postal">Código Postal</label>
                <input type="text" id="codigo_postal" name="codigo_postal" class="form-control" placeholder="Ej: 68000">
            </div>
            <div class="form-group">
                <label class="form-label" for="estado">Estado</label>
                <input type="text" id="estado" name="estado" class="form-control" placeholder="Ej: Oaxaca">
            </div>
            <div class="form-group">
                <label class="form-label" for="municipio">Municipio</label>
                <input type="text" id="municipio" name="municipio" class="form-control" placeholder="Ej: Oaxaca de Juárez">
            </div>
            <div class="form-group">
                <label class="form-label" for="colonia">Asentamiento</label>
                <select id="colonia" name="colonia" class="form-control">
                    <option value="">Seleccione un Asentamiento</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label" for="calle">Calle</label>
                <input type="text" id="calle" name="calle" class="form-control" placeholder="Ej: Av. Principal">
            </div>
            <div class="form-group">
                <label class="form-label" for="numero">Número</label>
                <input type="text" id="numero" name="numero" class="form-control" placeholder="Ej: 123">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group map-section">
                <h2 class="section-title">
                    <i class="fas fa-map"></i>
                    Ubicación en Mapa
                </h2>
                <p class="map-instructions">Puede arrastrar el marcador para ajustar la ubicación exacta</p>
                <div class="map-controls">
                    <button id="search-map-button" type="button" class="btn btn-primary">
                        <i class="fas fa-search"></i> Buscar Dirección
                    </button>
                </div>
                <div id="map" style="height: 250px; width: 100%; margin-top: 15px; border-radius: 8px;"></div>
            </div>
        </div>
    </div>
</div>
