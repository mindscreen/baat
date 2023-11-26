import * as CSS from 'csstype';

declare namespace Baact {
    type Booleanish = boolean | 'true' | 'false';
    type Key = string | number;

    interface Attributes {
        key?: Key | null | undefined;
    }

    type EventHandler<T = Event> = (event: T) => void

    export interface CSSProperties extends CSS.Properties<string | number> { }

    type BaactText = string | number;
    type BaactChild = BaactElement | BaactText;
    type BaactNode = BaactChild | BaactChild[] | boolean | null | undefined;

    type JSXElementConstructor<P> = ((props: P) => BaactElement<any, any> | null)

    interface BaactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
        type: T;
        props: P;
        key: Key | null;
    }

    interface BaactRef<R> {
        value: R
    }

    interface DOMAttributes<T, R> {
        key?: string | number | undefined;
        ref?: BaactRef<R> | undefined;
        children?: BaactNode | undefined;
        inert?: boolean | undefined;
        innerHTML?: string | undefined;
        onCopy?: EventHandler | undefined;
        onCopyCapture?: EventHandler | undefined;
        onCut?: EventHandler | undefined;
        onCutCapture?: EventHandler | undefined;
        onPaste?: EventHandler | undefined;
        onPasteCapture?: EventHandler | undefined;
        onCompositionEnd?: EventHandler | undefined;
        onCompositionEndCapture?: EventHandler | undefined;
        onCompositionStart?: EventHandler | undefined;
        onCompositionStartCapture?: EventHandler | undefined;
        onCompositionUpdate?: EventHandler | undefined;
        onCompositionUpdateCapture?: EventHandler | undefined;
        onFocus?: EventHandler | undefined;
        onFocusCapture?: EventHandler | undefined;
        onBlur?: EventHandler | undefined;
        onBlurCapture?: EventHandler | undefined;
        onChange?: EventHandler | undefined;
        onChangeCapture?: EventHandler | undefined;
        onBeforeInput?: EventHandler | undefined;
        onBeforeInputCapture?: EventHandler | undefined;
        onInput?: EventHandler | undefined;
        onInputCapture?: EventHandler | undefined;
        onReset?: EventHandler | undefined;
        onResetCapture?: EventHandler | undefined;
        onSubmit?: EventHandler | undefined;
        onSubmitCapture?: EventHandler | undefined;
        onInvalid?: EventHandler | undefined;
        onLoad?: EventHandler | undefined;
        onLoadCapture?: EventHandler | undefined;
        onError?: EventHandler | undefined;
        onErrorCapture?: EventHandler | undefined;
        onKeyDown?: EventHandler | undefined;
        onKeyDownCapture?: EventHandler | undefined;
        /** @deprecated */
        onKeyPress?: EventHandler | undefined;
        /** @deprecated */
        onKeyPressCapture?: EventHandler | undefined;
        onKeyUp?: EventHandler | undefined;
        onKeyUpCapture?: EventHandler | undefined;
        onAbort?: EventHandler | undefined;
        onAbortCapture?: EventHandler | undefined;
        onCanPlay?: EventHandler | undefined;
        onCanPlayCapture?: EventHandler | undefined;
        onCanPlayThrough?: EventHandler | undefined;
        onCanPlayThroughCapture?: EventHandler | undefined;
        onDurationChange?: EventHandler | undefined;
        onDurationChangeCapture?: EventHandler | undefined;
        onEmptied?: EventHandler | undefined;
        onEmptiedCapture?: EventHandler | undefined;
        onEncrypted?: EventHandler | undefined;
        onEncryptedCapture?: EventHandler | undefined;
        onEnded?: EventHandler | undefined;
        onEndedCapture?: EventHandler | undefined;
        onLoadedData?: EventHandler | undefined;
        onLoadedDataCapture?: EventHandler | undefined;
        onLoadedMetadata?: EventHandler | undefined;
        onLoadedMetadataCapture?: EventHandler | undefined;
        onLoadStart?: EventHandler | undefined;
        onLoadStartCapture?: EventHandler | undefined;
        onPause?: EventHandler | undefined;
        onPauseCapture?: EventHandler | undefined;
        onPlay?: EventHandler | undefined;
        onPlayCapture?: EventHandler | undefined;
        onPlaying?: EventHandler | undefined;
        onPlayingCapture?: EventHandler | undefined;
        onProgress?: EventHandler | undefined;
        onProgressCapture?: EventHandler | undefined;
        onRateChange?: EventHandler | undefined;
        onRateChangeCapture?: EventHandler | undefined;
        onSeeked?: EventHandler | undefined;
        onSeekedCapture?: EventHandler | undefined;
        onSeeking?: EventHandler | undefined;
        onSeekingCapture?: EventHandler | undefined;
        onStalled?: EventHandler | undefined;
        onStalledCapture?: EventHandler | undefined;
        onSuspend?: EventHandler | undefined;
        onSuspendCapture?: EventHandler | undefined;
        onTimeUpdate?: EventHandler | undefined;
        onTimeUpdateCapture?: EventHandler | undefined;
        onVolumeChange?: EventHandler | undefined;
        onVolumeChangeCapture?: EventHandler | undefined;
        onWaiting?: EventHandler | undefined;
        onWaitingCapture?: EventHandler | undefined;
        onAuxClick?: EventHandler | undefined;
        onAuxClickCapture?: EventHandler | undefined;
        onClick?: EventHandler | undefined;
        onClickCapture?: EventHandler | undefined;
        onContextMenu?: EventHandler | undefined;
        onContextMenuCapture?: EventHandler | undefined;
        onDoubleClick?: EventHandler | undefined;
        onDoubleClickCapture?: EventHandler | undefined;
        onDrag?: EventHandler<DragEvent> | undefined;
        onDragCapture?: EventHandler<DragEvent> | undefined;
        onDragEnd?: EventHandler<DragEvent> | undefined;
        onDragEndCapture?: EventHandler<DragEvent> | undefined;
        onDragEnter?: EventHandler<DragEvent> | undefined;
        onDragEnterCapture?: EventHandler<DragEvent> | undefined;
        onDragExit?: EventHandler<DragEvent> | undefined;
        onDragExitCapture?: EventHandler<DragEvent> | undefined;
        onDragLeave?: EventHandler<DragEvent> | undefined;
        onDragLeaveCapture?: EventHandler<DragEvent> | undefined;
        onDragOver?: EventHandler<DragEvent> | undefined;
        onDragOverCapture?: EventHandler<DragEvent> | undefined;
        onDragStart?: EventHandler<DragEvent> | undefined;
        onDragStartCapture?: EventHandler<DragEvent> | undefined;
        onDrop?: EventHandler | undefined;
        onDropCapture?: EventHandler | undefined;
        onMouseDown?: EventHandler<PointerEvent> | undefined;
        onMouseDownCapture?: EventHandler<PointerEvent> | undefined;
        onMouseEnter?: EventHandler<PointerEvent> | undefined;
        onMouseLeave?: EventHandler<PointerEvent> | undefined;
        onMouseMove?: EventHandler<PointerEvent> | undefined;
        onMouseMoveCapture?: EventHandler<PointerEvent> | undefined;
        onMouseOut?: EventHandler<PointerEvent> | undefined;
        onMouseOutCapture?: EventHandler<PointerEvent> | undefined;
        onMouseOver?: EventHandler<PointerEvent> | undefined;
        onMouseOverCapture?: EventHandler<PointerEvent> | undefined;
        onMouseUp?: EventHandler<PointerEvent> | undefined;
        onMouseUpCapture?: EventHandler<PointerEvent> | undefined;
        onSelect?: EventHandler | undefined;
        onSelectCapture?: EventHandler | undefined;
        onTouchCancel?: EventHandler | undefined;
        onTouchCancelCapture?: EventHandler | undefined;
        onTouchEnd?: EventHandler | undefined;
        onTouchEndCapture?: EventHandler | undefined;
        onTouchMove?: EventHandler | undefined;
        onTouchMoveCapture?: EventHandler | undefined;
        onTouchStart?: EventHandler | undefined;
        onTouchStartCapture?: EventHandler | undefined;
        onPointerDown?: EventHandler | undefined;
        onPointerDownCapture?: EventHandler | undefined;
        onPointerMove?: EventHandler | undefined;
        onPointerMoveCapture?: EventHandler | undefined;
        onPointerUp?: EventHandler | undefined;
        onPointerUpCapture?: EventHandler | undefined;
        onPointerCancel?: EventHandler | undefined;
        onPointerCancelCapture?: EventHandler | undefined;
        onPointerEnter?: EventHandler | undefined;
        onPointerEnterCapture?: EventHandler | undefined;
        onPointerLeave?: EventHandler | undefined;
        onPointerLeaveCapture?: EventHandler | undefined;
        onPointerOver?: EventHandler | undefined;
        onPointerOverCapture?: EventHandler | undefined;
        onPointerOut?: EventHandler | undefined;
        onPointerOutCapture?: EventHandler | undefined;
        onGotPointerCapture?: EventHandler | undefined;
        onGotPointerCaptureCapture?: EventHandler | undefined;
        onLostPointerCapture?: EventHandler | undefined;
        onLostPointerCaptureCapture?: EventHandler | undefined;
        onScroll?: EventHandler | undefined;
        onScrollCapture?: EventHandler | undefined;
        onWheel?: EventHandler | undefined;
        onWheelCapture?: EventHandler | undefined;
        onAnimationStart?: EventHandler | undefined;
        onAnimationStartCapture?: EventHandler | undefined;
        onAnimationEnd?: EventHandler | undefined;
        onAnimationEndCapture?: EventHandler | undefined;
        onAnimationIteration?: EventHandler | undefined;
        onAnimationIterationCapture?: EventHandler | undefined;
        onTransitionEnd?: EventHandler | undefined;
        onTransitionEndCapture?: EventHandler | undefined;
    }


    interface AriaAttributes {
        'aria-activedescendant'?: string | undefined;
        'aria-atomic'?: Booleanish | undefined;
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
        'aria-busy'?: Booleanish | undefined;
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        'aria-colcount'?: number | undefined;
        'aria-colindex'?: number | undefined;
        'aria-colspan'?: number | undefined;
        'aria-controls'?: string | undefined;
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
        'aria-describedby'?: string | undefined;
        'aria-details'?: string | undefined;
        'aria-disabled'?: Booleanish | undefined;
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
        'aria-errormessage'?: string | undefined;
        'aria-expanded'?: Booleanish | undefined;
        'aria-flowto'?: string | undefined;
        'aria-grabbed'?: Booleanish | undefined;
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
        'aria-hidden'?: Booleanish | undefined;
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
        'aria-keyshortcuts'?: string | undefined;
        'aria-label'?: string | undefined;
        'aria-labelledby'?: string | undefined;
        'aria-level'?: number | undefined;
        'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
        'aria-modal'?: Booleanish | undefined;
        'aria-multiline'?: Booleanish | undefined;
        'aria-multiselectable'?: Booleanish | undefined;
        'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
        'aria-owns'?: string | undefined;
        'aria-placeholder'?: string | undefined;
        'aria-posinset'?: number | undefined;
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        'aria-readonly'?: Booleanish | undefined;
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
        'aria-required'?: Booleanish | undefined;
        'aria-roledescription'?: string | undefined;
        'aria-rowcount'?: number | undefined;
        'aria-rowindex'?: number | undefined;
        'aria-rowspan'?: number | undefined;
        'aria-selected'?: Booleanish | undefined;
        'aria-setsize'?: number | undefined;
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
        'aria-valuemax'?: number | undefined;
        'aria-valuemin'?: number | undefined;
        'aria-valuenow'?: number | undefined;
        'aria-valuetext'?: string | undefined;
    }

    type AriaRole =
        | 'alert'
        | 'alertdialog'
        | 'application'
        | 'article'
        | 'banner'
        | 'button'
        | 'cell'
        | 'checkbox'
        | 'columnheader'
        | 'combobox'
        | 'complementary'
        | 'contentinfo'
        | 'definition'
        | 'dialog'
        | 'directory'
        | 'document'
        | 'feed'
        | 'figure'
        | 'form'
        | 'grid'
        | 'gridcell'
        | 'group'
        | 'heading'
        | 'img'
        | 'link'
        | 'list'
        | 'listbox'
        | 'listitem'
        | 'log'
        | 'main'
        | 'marquee'
        | 'math'
        | 'menu'
        | 'menubar'
        | 'menuitem'
        | 'menuitemcheckbox'
        | 'menuitemradio'
        | 'navigation'
        | 'none'
        | 'note'
        | 'option'
        | 'presentation'
        | 'progressbar'
        | 'radio'
        | 'radiogroup'
        | 'region'
        | 'row'
        | 'rowgroup'
        | 'rowheader'
        | 'scrollbar'
        | 'search'
        | 'searchbox'
        | 'separator'
        | 'slider'
        | 'spinbutton'
        | 'status'
        | 'switch'
        | 'tab'
        | 'table'
        | 'tablist'
        | 'tabpanel'
        | 'term'
        | 'textbox'
        | 'timer'
        | 'toolbar'
        | 'tooltip'
        | 'tree'
        | 'treegrid'
        | 'treeitem'
        | (string & {});

    interface HTMLAttributes<T, R = T> extends AriaAttributes, DOMAttributes<T, R> {
        defaultChecked?: boolean | undefined;
        defaultValue?: string | number | ReadonlyArray<string> | undefined;
        suppressContentEditableWarning?: boolean | undefined;
        suppressHydrationWarning?: boolean | undefined;

        accessKey?: string | undefined;
        class?: string | undefined;
        contentEditable?: Booleanish | "inherit" | undefined;
        contextMenu?: string | undefined;
        dir?: string | undefined;
        draggable?: Booleanish | undefined;
        hidden?: boolean | undefined;
        id?: string | undefined;
        lang?: string | undefined;
        placeholder?: string | undefined;
        slot?: string | undefined;
        spellCheck?: Booleanish | undefined;
        style?: CSSProperties | undefined;
        tabIndex?: number | undefined;
        title?: string | undefined;
        translate?: 'yes' | 'no' | undefined;
        radioGroup?: string | undefined;
        role?: AriaRole | undefined;
        about?: string | undefined;
        datatype?: string | undefined;
        inlist?: any;
        prefix?: string | undefined;
        property?: string | undefined;
        resource?: string | undefined;
        typeof?: string | undefined;
        vocab?: string | undefined;
        autoCapitalize?: string | undefined;
        autoCorrect?: string | undefined;
        autoSave?: string | undefined;
        color?: string | undefined;
        itemProp?: string | undefined;
        itemScope?: boolean | undefined;
        itemType?: string | undefined;
        itemID?: string | undefined;
        itemRef?: string | undefined;
        results?: number | undefined;
        security?: string | undefined;
        unselectable?: 'on' | 'off' | undefined;

        /**
         * Hints at the type of data that might be entered by the user while editing the element or its contents
         * @see https
         */
        inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
        /**
         * Specify that a standard HTML element should behave like a defined custom built-in element
         * @see https
         */
        is?: string | undefined;
    }

    interface SVGAttributes<T, R> extends AriaAttributes, DOMAttributes<T, R> {
        class?: string | undefined;
        color?: string | undefined;
        height?: number | string | undefined;
        id?: string | undefined;
        lang?: string | undefined;
        max?: number | string | undefined;
        media?: string | undefined;
        method?: string | undefined;
        min?: number | string | undefined;
        name?: string | undefined;
        style?: CSSProperties | undefined;
        target?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
        role?: AriaRole | undefined;
        tabIndex?: number | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        accentHeight?: number | string | undefined;
        accumulate?: "none" | "sum" | undefined;
        additive?: "replace" | "sum" | undefined;
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
            "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
        allowReorder?: "no" | "yes" | undefined;
        alphabetic?: number | string | undefined;
        amplitude?: number | string | undefined;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
        ascent?: number | string | undefined;
        attributeName?: string | undefined;
        attributeType?: string | undefined;
        autoReverse?: Booleanish | undefined;
        azimuth?: number | string | undefined;
        baseFrequency?: number | string | undefined;
        baselineShift?: number | string | undefined;
        baseProfile?: number | string | undefined;
        bbox?: number | string | undefined;
        begin?: number | string | undefined;
        bias?: number | string | undefined;
        by?: number | string | undefined;
        calcMode?: number | string | undefined;
        capHeight?: number | string | undefined;
        clip?: number | string | undefined;
        clipPath?: string | undefined;
        clipPathUnits?: number | string | undefined;
        clipRule?: number | string | undefined;
        colorInterpolation?: number | string | undefined;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
        colorProfile?: number | string | undefined;
        colorRendering?: number | string | undefined;
        contentScriptType?: number | string | undefined;
        contentStyleType?: number | string | undefined;
        cursor?: number | string | undefined;
        cx?: number | string | undefined;
        cy?: number | string | undefined;
        d?: string | undefined;
        decelerate?: number | string | undefined;
        descent?: number | string | undefined;
        diffuseConstant?: number | string | undefined;
        direction?: number | string | undefined;
        display?: number | string | undefined;
        divisor?: number | string | undefined;
        dominantBaseline?: number | string | undefined;
        dur?: number | string | undefined;
        dx?: number | string | undefined;
        dy?: number | string | undefined;
        edgeMode?: number | string | undefined;
        elevation?: number | string | undefined;
        enableBackground?: number | string | undefined;
        end?: number | string | undefined;
        exponent?: number | string | undefined;
        externalResourcesRequired?: Booleanish | undefined;
        fill?: string | undefined;
        fillOpacity?: number | string | undefined;
        fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
        filter?: string | undefined;
        filterRes?: number | string | undefined;
        filterUnits?: number | string | undefined;
        floodColor?: number | string | undefined;
        floodOpacity?: number | string | undefined;
        focusable?: Booleanish | "auto" | undefined;
        fontFamily?: string | undefined;
        fontSize?: number | string | undefined;
        fontSizeAdjust?: number | string | undefined;
        fontStretch?: number | string | undefined;
        fontStyle?: number | string | undefined;
        fontVariant?: number | string | undefined;
        fontWeight?: number | string | undefined;
        format?: number | string | undefined;
        fr?: number | string | undefined;
        from?: number | string | undefined;
        fx?: number | string | undefined;
        fy?: number | string | undefined;
        g1?: number | string | undefined;
        g2?: number | string | undefined;
        glyphName?: number | string | undefined;
        glyphOrientationHorizontal?: number | string | undefined;
        glyphOrientationVertical?: number | string | undefined;
        glyphRef?: number | string | undefined;
        gradientTransform?: string | undefined;
        gradientUnits?: string | undefined;
        hanging?: number | string | undefined;
        horizAdvX?: number | string | undefined;
        horizOriginX?: number | string | undefined;
        href?: string | undefined;
        ideographic?: number | string | undefined;
        imageRendering?: number | string | undefined;
        in2?: number | string | undefined;
        in?: string | undefined;
        intercept?: number | string | undefined;
        k1?: number | string | undefined;
        k2?: number | string | undefined;
        k3?: number | string | undefined;
        k4?: number | string | undefined;
        k?: number | string | undefined;
        kernelMatrix?: number | string | undefined;
        kernelUnitLength?: number | string | undefined;
        kerning?: number | string | undefined;
        keyPoints?: number | string | undefined;
        keySplines?: number | string | undefined;
        keyTimes?: number | string | undefined;
        lengthAdjust?: number | string | undefined;
        letterSpacing?: number | string | undefined;
        lightingColor?: number | string | undefined;
        limitingConeAngle?: number | string | undefined;
        local?: number | string | undefined;
        markerEnd?: string | undefined;
        markerHeight?: number | string | undefined;
        markerMid?: string | undefined;
        markerStart?: string | undefined;
        markerUnits?: number | string | undefined;
        markerWidth?: number | string | undefined;
        mask?: string | undefined;
        maskContentUnits?: number | string | undefined;
        maskUnits?: number | string | undefined;
        mathematical?: number | string | undefined;
        mode?: number | string | undefined;
        numOctaves?: number | string | undefined;
        offset?: number | string | undefined;
        opacity?: number | string | undefined;
        operator?: number | string | undefined;
        order?: number | string | undefined;
        orient?: number | string | undefined;
        orientation?: number | string | undefined;
        origin?: number | string | undefined;
        overflow?: number | string | undefined;
        overlinePosition?: number | string | undefined;
        overlineThickness?: number | string | undefined;
        paintOrder?: number | string | undefined;
        panose1?: number | string | undefined;
        path?: string | undefined;
        pathLength?: number | string | undefined;
        patternContentUnits?: string | undefined;
        patternTransform?: number | string | undefined;
        patternUnits?: string | undefined;
        pointerEvents?: number | string | undefined;
        points?: string | undefined;
        pointsAtX?: number | string | undefined;
        pointsAtY?: number | string | undefined;
        pointsAtZ?: number | string | undefined;
        preserveAlpha?: Booleanish | undefined;
        preserveAspectRatio?: string | undefined;
        primitiveUnits?: number | string | undefined;
        r?: number | string | undefined;
        radius?: number | string | undefined;
        refX?: number | string | undefined;
        refY?: number | string | undefined;
        renderingIntent?: number | string | undefined;
        repeatCount?: number | string | undefined;
        repeatDur?: number | string | undefined;
        requiredExtensions?: number | string | undefined;
        requiredFeatures?: number | string | undefined;
        restart?: number | string | undefined;
        result?: string | undefined;
        rotate?: number | string | undefined;
        rx?: number | string | undefined;
        ry?: number | string | undefined;
        scale?: number | string | undefined;
        seed?: number | string | undefined;
        shapeRendering?: number | string | undefined;
        slope?: number | string | undefined;
        spacing?: number | string | undefined;
        specularConstant?: number | string | undefined;
        specularExponent?: number | string | undefined;
        speed?: number | string | undefined;
        spreadMethod?: string | undefined;
        startOffset?: number | string | undefined;
        stdDeviation?: number | string | undefined;
        stemh?: number | string | undefined;
        stemv?: number | string | undefined;
        stitchTiles?: number | string | undefined;
        stopColor?: string | undefined;
        stopOpacity?: number | string | undefined;
        strikethroughPosition?: number | string | undefined;
        strikethroughThickness?: number | string | undefined;
        string?: number | string | undefined;
        stroke?: string | undefined;
        "stroke-dasharray"?: string | number | undefined;
        "stroke-dashoffset"?: string | number | undefined;
        "stroke-linecap"?: "butt" | "round" | "square" | "inherit" | undefined;
        "stroke-linejoin"?: "miter" | "round" | "bevel" | "inherit" | undefined;
        "stroke-miterlimit"?: number | string | undefined;
        "stroke-opacity"?: number | string | undefined;
        "stroke-width"?: number | string | undefined;
        surfaceScale?: number | string | undefined;
        systemLanguage?: number | string | undefined;
        tableValues?: number | string | undefined;
        targetX?: number | string | undefined;
        targetY?: number | string | undefined;
        textAnchor?: string | undefined;
        textDecoration?: number | string | undefined;
        textLength?: number | string | undefined;
        textRendering?: number | string | undefined;
        to?: number | string | undefined;
        transform?: string | undefined;
        u1?: number | string | undefined;
        u2?: number | string | undefined;
        underlinePosition?: number | string | undefined;
        underlineThickness?: number | string | undefined;
        unicode?: number | string | undefined;
        unicodeBidi?: number | string | undefined;
        unicodeRange?: number | string | undefined;
        unitsPerEm?: number | string | undefined;
        vAlphabetic?: number | string | undefined;
        values?: string | undefined;
        vectorEffect?: number | string | undefined;
        version?: string | undefined;
        vertAdvY?: number | string | undefined;
        vertOriginX?: number | string | undefined;
        vertOriginY?: number | string | undefined;
        vHanging?: number | string | undefined;
        vIdeographic?: number | string | undefined;
        viewBox?: string | undefined;
        viewTarget?: number | string | undefined;
        visibility?: number | string | undefined;
        vMathematical?: number | string | undefined;
        widths?: number | string | undefined;
        wordSpacing?: number | string | undefined;
        writingMode?: number | string | undefined;
        x1?: number | string | undefined;
        x2?: number | string | undefined;
        x?: number | string | undefined;
        xChannelSelector?: string | undefined;
        xHeight?: number | string | undefined;
        xlinkActuate?: string | undefined;
        xlinkArcrole?: string | undefined;
        xlinkHref?: string | undefined;
        xlinkRole?: string | undefined;
        xlinkShow?: string | undefined;
        xlinkTitle?: string | undefined;
        xlinkType?: string | undefined;
        xmlBase?: string | undefined;
        xmlLang?: string | undefined;
        xmlns?: string | undefined;
        xmlnsXlink?: string | undefined;
        xmlSpace?: string | undefined;
        y1?: number | string | undefined;
        y2?: number | string | undefined;
        y?: number | string | undefined;
        yChannelSelector?: string | undefined;
        z?: number | string | undefined;
        zoomAndPan?: string | undefined;
    }

    type HTMLAttributeReferrerPolicy =
        | ''
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';

    type HTMLAttributeAnchorTarget =
        | '_self'
        | '_blank'
        | '_parent'
        | '_top'
        | (string & {});

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T, T> {
        download?: any;
        href?: string | undefined;
        hrefLang?: string | undefined;
        media?: string | undefined;
        ping?: string | undefined;
        rel?: string | undefined;
        target?: HTMLAttributeAnchorTarget | undefined;
        type?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    }

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T, T> {
        alt?: string | undefined;
        coords?: string | undefined;
        download?: any;
        href?: string | undefined;
        hrefLang?: string | undefined;
        media?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        rel?: string | undefined;
        shape?: string | undefined;
        target?: string | undefined;
    }

    interface BaseHTMLAttributes<T> extends HTMLAttributes<T, T> {
        href?: string | undefined;
        target?: string | undefined;
    }

    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T, T> {
        cite?: string | undefined;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T, T> {
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        name?: string | undefined;
        type?: 'submit' | 'reset' | 'button' | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T, T> {
        height?: number | string | undefined;
        width?: number | string | undefined;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T, T> {
        span?: number | undefined;
        width?: number | string | undefined;
    }

    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T, T> {
        span?: number | undefined;
    }

    interface DataHTMLAttributes<T> extends HTMLAttributes<T, T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T, T> {
        open?: boolean | undefined;
        onToggle?: EventHandler | undefined;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T, T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
    }

    interface DialogHTMLAttributes<T> extends HTMLAttributes<T, T> {
        onCancel?: EventHandler |  undefined;
        onClose?: EventHandler |  undefined;
        open?: boolean | undefined;
    }

    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T, T> {
        height?: number | string | undefined;
        src?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T, T> {
        disabled?: boolean | undefined;
        form?: string | undefined;
        name?: string | undefined;
    }

    interface FormHTMLAttributes<T> extends HTMLAttributes<T, T> {
        acceptCharset?: string | undefined;
        action?: string | undefined;
        autoComplete?: string | undefined;
        encType?: string | undefined;
        method?: string | undefined;
        name?: string | undefined;
        noValidate?: boolean | undefined;
        target?: string | undefined;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T, T> {
        manifest?: string | undefined;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T, T> {
        allow?: string | undefined;
        allowFullScreen?: boolean | undefined;
        allowTransparency?: boolean | undefined;
        /** @deprecated */
        frameBorder?: number | string | undefined;
        height?: number | string | undefined;
        loading?: "eager" | "lazy" | undefined;
        /** @deprecated */
        marginHeight?: number | undefined;
        /** @deprecated */
        marginWidth?: number | undefined;
        name?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sandbox?: string | undefined;
        /** @deprecated */
        scrolling?: string | undefined;
        seamless?: boolean | undefined;
        src?: string | undefined;
        srcDoc?: string | undefined;
        width?: number | string | undefined;
    }

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T, T> {
        alt?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        decoding?: "async" | "auto" | "sync" | undefined;
        height?: number | string | undefined;
        loading?: "eager" | "lazy" | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
    }

    interface InsHTMLAttributes<T> extends HTMLAttributes<T, T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
    }

    type HTMLInputTypeAttribute =
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
        | (string & {});

    interface InputHTMLAttributes<T> extends HTMLAttributes<T, T> {
        accept?: string | undefined;
        alt?: string | undefined;
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        capture?: boolean | 'user' | 'environment' | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean | undefined;
        crossOrigin?: string | undefined;
        disabled?: boolean | undefined;
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        height?: number | string | undefined;
        list?: string | undefined;
        max?: number | string | undefined;
        maxLength?: number | undefined;
        min?: number | string | undefined;
        minLength?: number | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        pattern?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        src?: string | undefined;
        step?: number | string | undefined;
        type?: HTMLInputTypeAttribute | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        width?: number | string | undefined;

        onChange?: EventHandler | undefined;
    }

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T, T> {
        autoFocus?: boolean | undefined;
        challenge?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        keyType?: string | undefined;
        keyParams?: string | undefined;
        name?: string | undefined;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T, T> {
        form?: string | undefined;
        for?: string | undefined;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T, T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T, T> {
        as?: string | undefined;
        crossOrigin?: string | undefined;
        href?: string | undefined;
        hrefLang?: string | undefined;
        integrity?: string | undefined;
        media?: string | undefined;
        imageSrcSet?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        rel?: string | undefined;
        sizes?: string | undefined;
        type?: string | undefined;
        charSet?: string | undefined;
    }

    interface MapHTMLAttributes<T> extends HTMLAttributes<T, T> {
        name?: string | undefined;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T, T> {
        type?: string | undefined;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T, T> {
        autoPlay?: boolean | undefined;
        controls?: boolean | undefined;
        controlsList?: string | undefined;
        crossOrigin?: string | undefined;
        loop?: boolean | undefined;
        mediaGroup?: string | undefined;
        muted?: boolean | undefined;
        playsInline?: boolean | undefined;
        preload?: string | undefined;
        src?: string | undefined;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T, T> {
        charSet?: string | undefined;
        content?: string | undefined;
        httpEquiv?: string | undefined;
        name?: string | undefined;
        media?: string | undefined;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T, T> {
        form?: string | undefined;
        high?: number | undefined;
        low?: number | undefined;
        max?: number | string | undefined;
        min?: number | string | undefined;
        optimum?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T, T> {
        cite?: string | undefined;
    }

    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T, T> {
        classID?: string | undefined;
        data?: string | undefined;
        form?: string | undefined;
        height?: number | string | undefined;
        name?: string | undefined;
        type?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
        wmode?: string | undefined;
    }

    interface OlHTMLAttributes<T> extends HTMLAttributes<T, T> {
        reversed?: boolean | undefined;
        start?: number | undefined;
        type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
    }

    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T, T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
    }

    interface OptionHTMLAttributes<T> extends HTMLAttributes<T, T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
        selected?: boolean | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface OutputHTMLAttributes<T> extends HTMLAttributes<T, T> {
        form?: string | undefined;
        for?: string | undefined;
        name?: string | undefined;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T, T> {
        name?: string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T, T> {
        max?: number | string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface SlotHTMLAttributes<T> extends HTMLAttributes<T, T> {
        name?: string | undefined;
    }

    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T, T> {
        async?: boolean | undefined;
        /** @deprecated */
        charSet?: string | undefined;
        crossOrigin?: string | undefined;
        defer?: boolean | undefined;
        integrity?: string | undefined;
        noModule?: boolean | undefined;
        nonce?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        src?: string | undefined;
        type?: string | undefined;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T, T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        onChange?: EventHandler | undefined;
    }

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T, T> {
        height?: number | string | undefined;
        media?: string | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface StyleHTMLAttributes<T> extends HTMLAttributes<T, T> {
        media?: string | undefined;
        nonce?: string | undefined;
        scoped?: boolean | undefined;
        type?: string | undefined;
    }

    interface TableHTMLAttributes<T> extends HTMLAttributes<T, T> {
        cellPadding?: number | string | undefined;
        cellSpacing?: number | string | undefined;
        summary?: string | undefined;
        width?: number | string | undefined;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T, T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        cols?: number | undefined;
        dirName?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        name?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        rows?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        wrap?: string | undefined;

        onChange?: EventHandler | undefined;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T, T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
        height?: number | string | undefined;
        width?: number | string | undefined;
        valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T, T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T, T> {
        dateTime?: string | undefined;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T, T> {
        default?: boolean | undefined;
        kind?: string | undefined;
        label?: string | undefined;
        src?: string | undefined;
        srcLang?: string | undefined;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string | undefined;
        playsInline?: boolean | undefined;
        poster?: string | undefined;
        width?: number | string | undefined;
        disablePictureInPicture?: boolean | undefined;
        disableRemotePlayback?: boolean | undefined;
    }

    interface SVGProps<T, R = T> extends SVGAttributes<T, R> {
    }
}

declare global {
    namespace JSX {
        type Element = Baact.BaactElement<any, any> & Node

        interface IntrinsicElements {
            a: Baact.AnchorHTMLAttributes<HTMLAnchorElement>;
            abbr: Baact.HTMLAttributes<HTMLElement>;
            address: Baact.HTMLAttributes<HTMLElement>;
            area: Baact.AreaHTMLAttributes<HTMLAreaElement>;
            article: Baact.HTMLAttributes<HTMLElement>;
            aside: Baact.HTMLAttributes<HTMLElement>;
            audio: Baact.AudioHTMLAttributes<HTMLAudioElement>;
            b: Baact.HTMLAttributes<HTMLElement>;
            base: Baact.BaseHTMLAttributes<HTMLBaseElement>;
            bdi: Baact.HTMLAttributes<HTMLElement>;
            bdo: Baact.HTMLAttributes<HTMLElement>;
            big: Baact.HTMLAttributes<HTMLElement>;
            blockquote: Baact.BlockquoteHTMLAttributes<HTMLQuoteElement>;
            body: Baact.HTMLAttributes<HTMLBodyElement>;
            br: Baact.HTMLAttributes<HTMLBRElement>;
            button: Baact.ButtonHTMLAttributes<HTMLButtonElement>;
            canvas: Baact.CanvasHTMLAttributes<HTMLCanvasElement>;
            caption: Baact.HTMLAttributes<HTMLElement>;
            cite: Baact.HTMLAttributes<HTMLElement>;
            code: Baact.HTMLAttributes<HTMLElement>;
            col: Baact.ColHTMLAttributes<HTMLTableColElement>;
            colgroup: Baact.ColgroupHTMLAttributes<HTMLTableColElement>;
            data: Baact.DataHTMLAttributes<HTMLDataElement>;
            datalist: Baact.HTMLAttributes<HTMLDataListElement>;
            dd: Baact.HTMLAttributes<HTMLElement>;
            del: Baact.DelHTMLAttributes<HTMLModElement>;
            details: Baact.DetailsHTMLAttributes<HTMLDetailsElement>;
            dfn: Baact.HTMLAttributes<HTMLElement>;
            dialog: Baact.DialogHTMLAttributes<HTMLDialogElement>;
            div: Baact.HTMLAttributes<HTMLDivElement>;
            dl: Baact.HTMLAttributes<HTMLDListElement>;
            dt: Baact.HTMLAttributes<HTMLElement>;
            em: Baact.HTMLAttributes<HTMLElement>;
            embed: Baact.EmbedHTMLAttributes<HTMLEmbedElement>;
            fieldset: Baact.FieldsetHTMLAttributes<HTMLFieldSetElement>;
            figcaption: Baact.HTMLAttributes<HTMLElement>;
            figure: Baact.HTMLAttributes<HTMLElement>;
            footer: Baact.HTMLAttributes<HTMLElement>;
            form: Baact.FormHTMLAttributes<HTMLFormElement>;
            h1: Baact.HTMLAttributes<HTMLHeadingElement>;
            h2: Baact.HTMLAttributes<HTMLHeadingElement>;
            h3: Baact.HTMLAttributes<HTMLHeadingElement>;
            h4: Baact.HTMLAttributes<HTMLHeadingElement>;
            h5: Baact.HTMLAttributes<HTMLHeadingElement>;
            h6: Baact.HTMLAttributes<HTMLHeadingElement>;
            head: Baact.HTMLAttributes<HTMLHeadElement>;
            header: Baact.HTMLAttributes<HTMLElement>;
            hgroup: Baact.HTMLAttributes<HTMLElement>;
            hr: Baact.HTMLAttributes<HTMLHRElement>;
            html: Baact.HtmlHTMLAttributes<HTMLHtmlElement>;
            i: Baact.HTMLAttributes<HTMLElement>;
            iframe: Baact.IframeHTMLAttributes<HTMLIFrameElement>;
            img: Baact.ImgHTMLAttributes<HTMLImageElement>;
            input: Baact.InputHTMLAttributes<HTMLInputElement>;
            ins: Baact.InsHTMLAttributes<HTMLModElement>;
            kbd: Baact.HTMLAttributes<HTMLElement>;
            keygen: Baact.KeygenHTMLAttributes<HTMLElement>;
            label: Baact.LabelHTMLAttributes<HTMLLabelElement>;
            legend: Baact.HTMLAttributes<HTMLLegendElement>;
            li: Baact.LiHTMLAttributes<HTMLLIElement>;
            link: Baact.LinkHTMLAttributes<HTMLLinkElement>;
            main: Baact.HTMLAttributes<HTMLElement>;
            map: Baact.MapHTMLAttributes<HTMLMapElement>;
            mark: Baact.HTMLAttributes<HTMLElement>;
            menu: Baact.MenuHTMLAttributes<HTMLElement>;
            menuitem: Baact.HTMLAttributes<HTMLElement>;
            meta: Baact.MetaHTMLAttributes<HTMLMetaElement>;
            meter: Baact.MeterHTMLAttributes<HTMLMeterElement>;
            nav: Baact.HTMLAttributes<HTMLElement>;
            noindex: Baact.HTMLAttributes<HTMLElement>;
            noscript: Baact.HTMLAttributes<HTMLElement>;
            object: Baact.ObjectHTMLAttributes<HTMLObjectElement>;
            ol: Baact.OlHTMLAttributes<HTMLOListElement>;
            optgroup: Baact.OptgroupHTMLAttributes<HTMLOptGroupElement>;
            option: Baact.OptionHTMLAttributes<HTMLOptionElement>;
            output: Baact.OutputHTMLAttributes<HTMLOutputElement>;
            p: Baact.HTMLAttributes<HTMLParagraphElement>;
            param: Baact.ParamHTMLAttributes<HTMLParamElement>;
            picture: Baact.HTMLAttributes<HTMLElement>;
            pre: Baact.HTMLAttributes<HTMLPreElement>;
            progress: Baact.ProgressHTMLAttributes<HTMLProgressElement>;
            q: Baact.QuoteHTMLAttributes<HTMLQuoteElement>;
            rp: Baact.HTMLAttributes<HTMLElement>;
            rt: Baact.HTMLAttributes<HTMLElement>;
            ruby: Baact.HTMLAttributes<HTMLElement>;
            s: Baact.HTMLAttributes<HTMLElement>;
            samp: Baact.HTMLAttributes<HTMLElement>;
            slot: Baact.SlotHTMLAttributes<HTMLSlotElement>;
            script: Baact.ScriptHTMLAttributes<HTMLScriptElement>;
            section: Baact.HTMLAttributes<HTMLElement>;
            select: Baact.SelectHTMLAttributes<HTMLSelectElement>;
            small: Baact.HTMLAttributes<HTMLElement>;
            source: Baact.SourceHTMLAttributes<HTMLSourceElement>;
            span: Baact.HTMLAttributes<HTMLSpanElement>;
            strong: Baact.HTMLAttributes<HTMLElement>;
            style: Baact.StyleHTMLAttributes<HTMLStyleElement>;
            sub: Baact.HTMLAttributes<HTMLElement>;
            summary: Baact.HTMLAttributes<HTMLElement>;
            sup: Baact.HTMLAttributes<HTMLElement>;
            table: Baact.TableHTMLAttributes<HTMLTableElement>;
            template: Baact.HTMLAttributes<HTMLTemplateElement>;
            tbody: Baact.HTMLAttributes<HTMLTableSectionElement>;
            td: Baact.TdHTMLAttributes<HTMLTableDataCellElement>;
            textarea: Baact.TextareaHTMLAttributes<HTMLTextAreaElement>;
            tfoot: Baact.HTMLAttributes<HTMLTableSectionElement>;
            th: Baact.ThHTMLAttributes<HTMLTableHeaderCellElement>;
            thead: Baact.HTMLAttributes<HTMLTableSectionElement>;
            time: Baact.TimeHTMLAttributes<HTMLTimeElement>;
            title: Baact.HTMLAttributes<HTMLTitleElement>;
            tr: Baact.HTMLAttributes<HTMLTableRowElement>;
            track: Baact.TrackHTMLAttributes<HTMLTrackElement>;
            u: Baact.HTMLAttributes<HTMLElement>;
            ul: Baact.HTMLAttributes<HTMLUListElement>;
            "var": Baact.HTMLAttributes<HTMLElement>;
            video: Baact.VideoHTMLAttributes<HTMLVideoElement>;
            wbr: Baact.HTMLAttributes<HTMLElement>;
            svg: Baact.SVGProps<SVGSVGElement>;
            animate: Baact.SVGProps<SVGElement>;
            animateMotion: Baact.SVGProps<SVGElement>;
            animateTransform: Baact.SVGProps<SVGElement>;
            circle: Baact.SVGProps<SVGCircleElement>;
            clipPath: Baact.SVGProps<SVGClipPathElement>;
            defs: Baact.SVGProps<SVGDefsElement>;
            desc: Baact.SVGProps<SVGDescElement>;
            ellipse: Baact.SVGProps<SVGEllipseElement>;
            feBlend: Baact.SVGProps<SVGFEBlendElement>;
            feColorMatrix: Baact.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: Baact.SVGProps<SVGFEComponentTransferElement>;
            feComposite: Baact.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: Baact.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: Baact.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: Baact.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: Baact.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: Baact.SVGProps<SVGFEDropShadowElement>;
            feFlood: Baact.SVGProps<SVGFEFloodElement>;
            feFuncA: Baact.SVGProps<SVGFEFuncAElement>;
            feFuncB: Baact.SVGProps<SVGFEFuncBElement>;
            feFuncG: Baact.SVGProps<SVGFEFuncGElement>;
            feFuncR: Baact.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: Baact.SVGProps<SVGFEGaussianBlurElement>;
            feImage: Baact.SVGProps<SVGFEImageElement>;
            feMerge: Baact.SVGProps<SVGFEMergeElement>;
            feMergeNode: Baact.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: Baact.SVGProps<SVGFEMorphologyElement>;
            feOffset: Baact.SVGProps<SVGFEOffsetElement>;
            fePointLight: Baact.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: Baact.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: Baact.SVGProps<SVGFESpotLightElement>;
            feTile: Baact.SVGProps<SVGFETileElement>;
            feTurbulence: Baact.SVGProps<SVGFETurbulenceElement>;
            filter: Baact.SVGProps<SVGFilterElement>;
            foreignObject: Baact.SVGProps<SVGForeignObjectElement>;
            g: Baact.SVGProps<SVGGElement>;
            image: Baact.SVGProps<SVGImageElement>;
            line: Baact.SVGProps<SVGLineElement>;
            linearGradient: Baact.SVGProps<SVGLinearGradientElement>;
            marker: Baact.SVGProps<SVGMarkerElement>;
            mask: Baact.SVGProps<SVGMaskElement>;
            metadata: Baact.SVGProps<SVGMetadataElement>;
            mpath: Baact.SVGProps<SVGElement>;
            path: Baact.SVGProps<SVGPathElement>;
            pattern: Baact.SVGProps<SVGPatternElement>;
            polygon: Baact.SVGProps<SVGPolygonElement>;
            polyline: Baact.SVGProps<SVGPolylineElement>;
            radialGradient: Baact.SVGProps<SVGRadialGradientElement>;
            rect: Baact.SVGProps<SVGRectElement>;
            stop: Baact.SVGProps<SVGStopElement>;
            switch: Baact.SVGProps<SVGSwitchElement>;
            symbol: Baact.SVGProps<SVGSymbolElement>;
            text: Baact.SVGProps<SVGTextElement>;
            textPath: Baact.SVGProps<SVGTextPathElement>;
            tspan: Baact.SVGProps<SVGTSpanElement>;
            use: Baact.SVGProps<SVGUseElement>;
            view: Baact.SVGProps<SVGViewElement>;
        }
    }
}
